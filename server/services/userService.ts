import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import PrisonApiClient, { CaseLoad } from '../data/prisonApiClient'

export interface UserDetails extends User {
  displayName: string
  activeCaseLoad: CaseLoad
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    const allCaseLoads = await new PrisonApiClient(token).getUserCaseLoads()
    return {
      ...user,
      displayName: convertToTitleCase(user.name),
      activeCaseLoad: allCaseLoads.find((caseLoad: CaseLoad) => caseLoad.currentlyActive),
    }
  }

  async getUserRoles(token: string): Promise<string[]> {
    return this.manageUsersApiClient.getUserRoles(token)
  }
}
