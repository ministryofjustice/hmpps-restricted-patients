import 'reflect-metadata'
import express from 'express'

import path from 'path'
import createError from 'http-errors'

import routes from './routes'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'

import setUpWebSession from './middleware/setUpWebSession'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpAuthentication from './middleware/setUpAuthentication'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import logger from '../logger'
import { Services } from './services'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setupJourneyStart from './routes/journeyStartRouter'

export default function createApp(services: Services): express.Application {
  // We do not want the server to exit, partly because any log information will be lost.
  // Instead, log the error so we can trace, diagnose and fix the problem.
  process.on('uncaughtException', (err, origin) => {
    logger.error(`Uncaught Exception`, err, origin)
  })
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`)
  })

  const app = express()
  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use((req, res, next) => {
    res.locals = {
      ...res.locals,
      currentUrlPath: req.baseUrl + req.path,
      hostname: req.hostname,
    }

    next()
  })
  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware(false))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))

  app.use(setupJourneyStart())
  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
