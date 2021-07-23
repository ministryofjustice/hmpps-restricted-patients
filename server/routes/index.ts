import type { RequestHandler, Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'

import asyncMiddleware from '../middleware/asyncMiddleware'

import { Services } from '../services'

export default function routes(router: Router, { prisonerSearchService }: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))

  return router
}
