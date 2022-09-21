import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import MovePrisonerService from './movePrisonerService'
import RestrictedPatientSearchService from './restrictedPatientSearchService'
import HmppsAuthClient from '../data/hmppsAuthClient'

import TokenStore from '../data/tokenStore'
import RemoveRestrictedPatientService from './removeRestrictedPatientService'
import HospitalSearchService from './hospitalSearchService'
import MigratePrisonerService from './migratePrisonerService'

const hmppsAuthClient = new HmppsAuthClient(new TokenStore())
const userService = new UserService(hmppsAuthClient)
const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
const movePrisonerService = new MovePrisonerService()
const hospitalSearchService = new HospitalSearchService()
const restrictedPatientSearchService = new RestrictedPatientSearchService()
const removeRestrictedPatientService = new RemoveRestrictedPatientService(hmppsAuthClient)
const migratePrisonerService = new MigratePrisonerService()

export const services = {
  userService,
  prisonerSearchService,
  movePrisonerService,
  restrictedPatientSearchService,
  removeRestrictedPatientService,
  hospitalSearchService,
  migratePrisonerService,
}

export type Services = typeof services
