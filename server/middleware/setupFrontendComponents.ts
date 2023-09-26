import type { RequestHandler } from 'express'
import { Router } from 'express'

import logger from '../../logger'
import { Services } from '../services'
import FrontendComponentsService from '../services/frontendComponentsService'
import config from '../config'

export default function setupFrontendComponents({ frontendComponentsService }: Services): RequestHandler {
  const router = Router({ mergeParams: true })

  if (config.apis.frontendComponents.enabled) {
    router.use(getFrontendComponents(frontendComponentsService))
  }
  return router
}

function getFrontendComponents(frontendComponentsService: FrontendComponentsService): RequestHandler {
  return async (_req, res, next) => {
    try {
      res.locals.frontendComponents = await frontendComponentsService.getComponents(res.locals.user.token)
    } catch (error) {
      logger.error(error, 'Failed to retrieve front end components')
    }
    next()
  }
}
