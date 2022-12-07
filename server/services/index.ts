import { dataAccess } from '../data'

import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import MovePrisonerService from './movePrisonerService'
import RestrictedPatientSearchService from './restrictedPatientSearchService'
import RemoveRestrictedPatientService from './removeRestrictedPatientService'
import HospitalSearchService from './hospitalSearchService'
import MigratePrisonerService from './migratePrisonerService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const movePrisonerService = new MovePrisonerService()
  const hospitalSearchService = new HospitalSearchService()
  const restrictedPatientSearchService = new RestrictedPatientSearchService()
  const removeRestrictedPatientService = new RemoveRestrictedPatientService(hmppsAuthClient)
  const migratePrisonerService = new MigratePrisonerService()

  return {
    userService,
    prisonerSearchService,
    movePrisonerService,
    restrictedPatientSearchService,
    removeRestrictedPatientService,
    hospitalSearchService,
    migratePrisonerService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
