import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'

export default function routes(router: Router): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())

  return router
}
