import type { RequestHandler, Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'

import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(router: Router): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  router.use('/search-for-prisoner', prisonerSearchRoutes())

  return router
}
