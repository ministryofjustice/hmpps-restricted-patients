import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import MovePrisonerService from './movePrisonerService'
import RestrictedPatientSearchService from './restrictedPatientSearchService'
import HmppsAuthClient from '../data/hmppsAuthClient'

import TokenStore from '../data/tokenStore'

const hmppsAuthClient = new HmppsAuthClient(new TokenStore())
const userService = new UserService(hmppsAuthClient)
const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
const movePrisonerService = new MovePrisonerService(hmppsAuthClient)
const restrictedPatientSearchService = new RestrictedPatientSearchService(hmppsAuthClient)

export const services = {
  userService,
  prisonerSearchService,
  movePrisonerService,
  restrictedPatientSearchService,
}

export type Services = typeof services
