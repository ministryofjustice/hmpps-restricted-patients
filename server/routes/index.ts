import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import homepageController from '../controllers/homepage'

export default function routes(router: Router): Router {
  router.get('/$', homepageController)
  router.use('/search-for-prisoner', prisonerSearchRoutes())

  return router
}
