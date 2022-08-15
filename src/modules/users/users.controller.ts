import express from 'express'
import { check, validationResult } from 'express-validator'
import { ERROR_MESSAGES, handleError } from '../../errors/errors.js'
import { usersFactory } from '../users/users.factory'
import { IUserSortParameters } from './interfaces/parameters.js'
import { Role } from '../../enums/role.js'

export const userRouter = express.Router()

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Registration error', errors: errors.array() })
    }

    const { firstName, lastName, age, email, role, password } = req.body
    if (role !== Role.ADMIN && role !== Role.CUSTOMER) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_ROLE)
    }
    const service = usersFactory.chooseUserService(req.user)
    const user = await service.create({
      firstName,
      lastName,
      age,
      email,
      role,
      password,
    })
    res.status(201).json(user)
  } catch (error) {
    handleError(res, error)
  }
}

const getAllUsers = async (req, res) => {
  try {
    const { filterBy, filterText, sortBy, direction, limit, skip } = req.query
    let filter = {}
    if (filterBy !== undefined && filterText !== undefined) {
      filter[filterBy] = filterText
    }

    const service = usersFactory.chooseUserService(req.user)
    const users = await service.getAll({
      filter,
      sortBy,
      direction,
      limit: Number(limit),
      skip: Number(skip),
    } as IUserSortParameters)
    return res.status(200).json(users)
  } catch (error) {
    handleError(res, error)
  }
}

const getOneUser = async (req, res) => {
  try {
    const service = usersFactory.chooseUserService(req.user)
    const user = await service.getOneById(req.params.id)
    return res.status(200).json(user)
  } catch (error) {
    handleError(res, error)
  }
}

const updateUser = async (req, res) => {
  try {
    if (req.body.role !== Role.ADMIN && req.body.role !== Role.CUSTOMER) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_ROLE)
    }
    const service = usersFactory.chooseUserService(req.user)
    const updatedUser = await service.update(req.user, req.params.id, req.body)
    return res.status(200).json(updatedUser)
  } catch (error) {
    handleError(res, error)
  }
}

const deleteUser = async (req, res) => {
  try {
    const service = usersFactory.chooseUserService(req.user)
    const user = await service.delete(req.user, req.params.id)
    return res.status(200).json(user)
  } catch (error) {
    handleError(res, error)
  }
}

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Login error', errors: errors.array() })
    }

    const { email, password } = req.body
    const service = usersFactory.chooseUserService(req.user)
    const userToken = await service.login(email, password)
    res.send({ access_token: userToken })
  } catch (error) {
    handleError(res, error)
  }
}

userRouter.post(
  '/users',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  createUser
)
userRouter.get('/users', getAllUsers)
userRouter.get('/users/:id', getOneUser)
userRouter.put('/users/:id', updateUser)
userRouter.delete('/users/:id', deleteUser)
userRouter.post(
  '/login',
  [
    check('email', 'Enter a valid email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists(),
  ],
  loginUser
)
