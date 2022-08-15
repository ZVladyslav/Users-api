import { UserSchema } from '../../schemas/users.schema'
import { IUser, IUserWithoutId } from './interfaces/user'
import { IUserSortParameters } from './interfaces/parameters'

class UserRepository {
  async create(user: IUserWithoutId): Promise<IUser> {
    const createdUser = await UserSchema.create(user)
    return createdUser
  }

  async findOneById(id: IUser['id']): Promise<IUser> {
    let user: IUser
    try {
      user = await UserSchema.findById(id)
    } catch (error) {
      user = null
    }
    return user
  }

  async findOneByEmail(email: IUser['email']): Promise<IUser> {
    const user = await UserSchema.findOne({ email })
    if (user === undefined) {
      return null
    }
    return user
  }

  async findAndSort(parameters: IUserSortParameters): Promise<IUser[]> {
    let params = Object.entries(parameters.filter).reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {}
    )
    const users = await UserSchema.find(params)
      .sort({ [parameters.sortBy]: parameters.direction })
      .skip(parameters.skip)
      .limit(parameters.limit)
    return users
  }

  async update(id: IUser['id'], user: IUser): Promise<IUser> {
    const updatedUser = await UserSchema.findByIdAndUpdate(id, user, {
      new: true,
    })
    return updatedUser
  }

  async delete(id: IUser['id']): Promise<IUser> {
    const deletedUser = await UserSchema.findByIdAndDelete(id)
    return deletedUser
  }
}

export const userRepository = new UserRepository()
