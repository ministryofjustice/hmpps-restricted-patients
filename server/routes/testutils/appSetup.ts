import 'reflect-metadata'
import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'
import jwtDecode from 'jwt-decode'

import allRoutes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import standardRouter from '../standardRouter'
import UserService from '../../services/userService'
import * as auth from '../../authentication/auth'
import PrisonerSearchService from '../../services/prisonerSearchService'
import MovePrisonerService from '../../services/movePrisonerService'
import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'
import { Services } from '../../services'
import RemoveRestrictedPatientService from '../../services/removeRestrictedPatientService'
import HospitalSearchService from '../../services/hospitalSearchService'

const user = {
  name: 'john smith',
  firstName: 'john',
  lastName: 'smith',
  username: 'user1',
  displayName: 'John Smith',
  activeCaseLoadId: 'MDI',
  allCaseLoads: [
    {
      caseLoadId: 'MDI',
      description: 'Moorland',
      type: 'INST',
      caseloadFunction: 'TEST',
      currentlyActive: true,
    },
    {
      caseLoadId: 'LEI',
      description: 'Leeds',
      type: 'INST',
      caseloadFunction: 'TEST',
      currentlyActive: false,
    },
  ],
  activeCaseLoad: {
    caseLoadId: 'MDI',
    description: 'Moorland',
    type: 'INST',
    caseloadFunction: 'TEST',
    currentlyActive: true,
  },
  token: 'token',
  authSource: 'NOMIS',
}

class MockUserService extends UserService {
  constructor() {
    super(undefined)
  }

  async getUser(token: string) {
    return {
      token,
      ...user,
    }
  }
}

export const flashProvider = jest.fn()
jest.mock('jwt-decode', () => jest.fn())
export const mockJwtDecode = jwtDecode as jest.Mock

function appSetup(
  services: Services,
  production: boolean,
  session: Record<string, unknown>,
  userSupplier: () => Express.User
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {}
    res.locals.user = { ...req.user }
    next()
  })

  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    Object.entries(session).forEach(([key, value]) => {
      req.session[key] = value
    })
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    allRoutes(standardRouter(new MockUserService()), {
      userService: new MockUserService(),
      prisonerSearchService: {} as PrisonerSearchService,
      movePrisonerService: {} as MovePrisonerService,
      restrictedPatientSearchService: {} as RestrictedPatientSearchService,
      removeRestrictedPatientService: {} as RemoveRestrictedPatientService,
      hospitalSearchService: {} as HospitalSearchService,
      ...services,
    })
  )
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export default function appWithAllRoutes({
  production = false,
  services = {},
  session = {},
  userSupplier = () => user,
  roles = [],
}: {
  production?: boolean
  services?: Partial<Services>
  session?: Record<string, unknown>
  userSupplier?: () => Express.User
  roles?: string[]
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  const authorities = roles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  mockJwtDecode.mockImplementation(() => ({ authorities }))
  return appSetup(services as Services, production, session, userSupplier)
}
