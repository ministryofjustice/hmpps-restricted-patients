import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import MovePrisonerService from './movePrisonerService'
import RestrictedPatientSearchService from './restrictedPatientSearchService'
import RemoveRestrictedPatientService from './removeRestrictedPatientService'
import AgencySearchService from './agencySearchService'
import MigratePrisonerService from './migratePrisonerService'
import FrontendComponentsService from './frontendComponentsService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const movePrisonerService = new MovePrisonerService()
  const agencySearchService = new AgencySearchService()
  const restrictedPatientSearchService = new RestrictedPatientSearchService()
  const removeRestrictedPatientService = new RemoveRestrictedPatientService(hmppsAuthClient)
  const migratePrisonerService = new MigratePrisonerService()
  const frontendComponentsService = new FrontendComponentsService()

  return {
    applicationInfo,
    userService,
    prisonerSearchService,
    movePrisonerService,
    restrictedPatientSearchService,
    removeRestrictedPatientService,
    agencySearchService,
    migratePrisonerService,
    frontendComponentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
