import type { RequestHandler, Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'

import homepageController from '../controllers/homepage'

import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(router: Router): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  router.use('/manage-restricted-patients/', homepageController())
  router.use('/manage-restricted-patients/search-for-prisoner', prisonerSearchRoutes())

  return router
}
