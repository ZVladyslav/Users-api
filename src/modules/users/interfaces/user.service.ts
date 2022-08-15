import { IUser, IUserWithoutId } from './user'
import { IUserSortParameters } from './parameters'

export interface IUserService {
  create(user: IUserWithoutId): Promise<IUser>
  getAll(parameters: IUserSortParameters): Promise<IUser[]>
  getOneById(id: IUser['id']): Promise<IUser>
  update(
    callerUser: IUser,
    idUserToUpdate: IUser['id'],
    updatingUser: IUser
  ): Promise<IUser>
  delete(callerUser: IUser, idUserToDelete: IUser['id']): Promise<IUser>
  login(email: IUser['email'], password: IUser['password']): Promise<String>
}
