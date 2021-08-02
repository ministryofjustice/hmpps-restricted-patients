import 'reflect-metadata'
import express, { Router, Express } from 'express'
import cookieSession from 'cookie-session'
import createError from 'http-errors'
import path from 'path'

import flash from 'connect-flash'
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
import internalRedirectMiddleware from '../../middleware/internalRedirectMiddleware'

const user = {
  name: 'john smith',
  firstName: 'john',
  lastName: 'smith',
  username: 'user1',
  displayName: 'John Smith',
  activeCaseLoadId: 'MDI',
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

function appSetup(route: Router, production: boolean): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)

  app.use((req, res, next) => {
    res.locals = {}
    res.locals.user = user
    next()
  })

  app.use(cookieSession({ keys: [''] }))
  app.use(flash())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(internalRedirectMiddleware)
  app.use('/', route)
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(production))

  return app
}

export default function appWithAllRoutes(
  { production = false }: { production?: boolean },
  overrides: Partial<Services> = {}
): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(
    allRoutes(standardRouter(new MockUserService()), {
      userService: new MockUserService(),
      prisonerSearchService: {} as PrisonerSearchService,
      movePrisonerService: {} as MovePrisonerService,
      restrictedPatientSearchService: {} as RestrictedPatientSearchService,
      ...overrides,
    }),
    production
  )
}
