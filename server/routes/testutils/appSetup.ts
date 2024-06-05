import 'reflect-metadata'
import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import { NotFound } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import jwtDecode from 'jwt-decode'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import type { Services } from '../../services'
import type { ApplicationInfo } from '../../applicationInfo'
import { PrisonUser } from '../../interfaces/hmppsUser'

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  branchName: 'main',
}

export const user: PrisonUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  activeCaseLoadId: 'MDI',
  userRoles: [],
}

export const flashProvider = jest.fn()
jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))
export const mockJwtDecode = jwtDecode.jwtDecode as jest.Mock

function appSetup(
  services: Services,
  production: boolean,
  session: Record<string, unknown>,
  userSupplier: () => PrisonUser,
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as PrisonUser,
    }
    Object.entries(session).forEach(([key, value]) => {
      // @ts-expect-error assignment of any type ignored
      req.session[key] = value
    })
    next()
  })
  app.use((req, res, next) => {
    req.id = uuidv4()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
  session = {},
  userSupplier = () => user,
  roles = [],
}: {
  production?: boolean
  services?: Partial<Services>
  session?: Record<string, unknown>
  userSupplier?: () => PrisonUser
  roles?: string[]
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  const authorities = roles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  mockJwtDecode.mockImplementation(() => ({ authorities }))
  return appSetup(services as Services, production, session, userSupplier)
}
