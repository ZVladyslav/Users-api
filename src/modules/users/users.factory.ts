import { IUser } from './interfaces/user'
import { IUserService } from './interfaces/user.service'
import { adminUserService } from '../users/admin.users.service'
import { customerUserService } from '../users/customer.users.service'
import { Role } from '../../enums/role'

class UsersFactory {
  chooseUserService(user?: IUser): IUserService {
    switch (user?.role) {
      case Role.ADMIN:
        return adminUserService
      case Role.CUSTOMER:
        return customerUserService
      default:
        return adminUserService
    }
  }
}

export const usersFactory = new UsersFactory()
