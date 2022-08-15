import { Role } from '../../../enums/role'

export interface IUserSortParameters {
  filter?: {
    firstName?: string
    lastName?: string
    email?: string
    role?: Role
  }
  sortBy?: 'firstName' | 'lastName' | 'email' | 'age'
  direction?: 'ASC' | 'DESC'
  limit?: number
  skip?: number
}
