import { Role } from '../../../enums/role'

export interface IUser {
  id: string
  firstName: string
  lastName: string
  age: number
  email: string
  role: Role
  password: string
}

export type IUserWithoutId = Omit<IUser, 'id'>
