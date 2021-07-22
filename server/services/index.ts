// import config from '../config'

import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import HmppsAuthClient from '../data/hmppsAuthClient'

import TokenStore from '../data/tokenStore'

const hmppsAuthClient = new HmppsAuthClient(new TokenStore())
const userService = new UserService(hmppsAuthClient)
const prisonerSearchService = new PrisonerSearchService()

export const services = {
  userService,
  prisonerSearchService,
}

export type Services = typeof services
