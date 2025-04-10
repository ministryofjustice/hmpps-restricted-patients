import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import MovePrisonerService from './movePrisonerService'
import RestrictedPatientSearchService from './restrictedPatientSearchService'
import RemoveRestrictedPatientService from './removeRestrictedPatientService'
import AgencySearchService from './agencySearchService'
import MigratePrisonerService from './migratePrisonerService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, prisonApiClient } = dataAccess()

  return {
    applicationInfo,
    userService: new UserService(manageUsersApiClient),
    prisonerSearchService: new PrisonerSearchService(hmppsAuthClient, prisonApiClient),
    movePrisonerService: new MovePrisonerService(),
    restrictedPatientSearchService: new RestrictedPatientSearchService(prisonApiClient),
    removeRestrictedPatientService: new RemoveRestrictedPatientService(hmppsAuthClient, prisonApiClient),
    agencySearchService: new AgencySearchService(prisonApiClient),
    migratePrisonerService: new MigratePrisonerService(),
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
