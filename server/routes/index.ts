import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'

import { Services } from '../services'

export default function routes(router: Router, { prisonerSearchService, movePrisonerService }: Services): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/move-to-hospital', movePrisonerRoutes({ movePrisonerService, prisonerSearchService }))

  return router
}
