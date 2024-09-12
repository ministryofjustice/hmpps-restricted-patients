import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<User> {
    return this.manageUsersApiClient.getUser(token)
  }
}
