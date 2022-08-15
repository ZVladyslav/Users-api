import { userRepository } from './users.repository.js'
import { IUser, IUserWithoutId } from './interfaces/user'
import { IUserService } from './interfaces/user.service'
import { IUserSortParameters } from './interfaces/parameters.js'
import { ERROR_MESSAGES } from '../../errors/errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AdminUserService implements IUserService {
  async create(user: IUserWithoutId): Promise<IUser> {
    const candidate = await userRepository.findOneByEmail(user.email)
    if (candidate !== null) {
      throw new Error(ERROR_MESSAGES.ALREADY_CREATED)
    }

    const hashPassword = await bcrypt.hash(user.password, 10)

    return await userRepository.create({
      ...user,
      password: hashPassword,
    })
  }

  async getOneById(id: IUser['id']): Promise<IUser> {
    const user = await userRepository.findOneById(id)
    if (user === null) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_ID)
    }
    return user
  }

  async getAll(parameters: IUserSortParameters): Promise<IUser[]> {
    const {
      filter,
      sortBy = 'firstName',
      direction = 'ASC',
      limit = 3,
      skip = 0,
    } = parameters
    const users = await userRepository.findAndSort({
      filter,
      sortBy,
      direction,
      limit,
      skip,
    })
    return users
  }

  async update(
    callerUser: IUser,
    idUserToUpdate: IUser['id'],
    user: IUser
  ): Promise<IUser> {
    const userWithId = await userRepository.findOneById(idUserToUpdate)
    if (userWithId === null) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_ID)
    }
    const userWithEmail = await userRepository.findOneByEmail(user.email)
    if (userWithEmail === null) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_EMAIL)
    }
    const hashPassword = await bcrypt.hash(user.password, 10)
    const updatedUser = await userRepository.update(idUserToUpdate, {
      ...user,
      password: hashPassword,
    })
    return updatedUser
  }

  async delete(callerUser: IUser, idUserToDelete: IUser['id']): Promise<IUser> {
    const user = await userRepository.findOneById(idUserToDelete)
    if (user === null) {
      throw new Error(ERROR_MESSAGES.NO_MATCH_ID)
    }
    const deletedUser = await userRepository.delete(idUserToDelete)
    return deletedUser
  }

  async login(
    email: IUser['email'],
    password: IUser['password']
  ): Promise<String> {
    const userWithEmail = await userRepository.findOneByEmail(email)
    if (userWithEmail === null) {
      throw new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR)
    }
    const validPassword = await bcrypt.compare(password, userWithEmail.password)
    if (!validPassword) {
      throw new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR)
    }
    return jwt.sign({ id: userWithEmail.id }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    })
  }
}

export const adminUserService = new AdminUserService()
