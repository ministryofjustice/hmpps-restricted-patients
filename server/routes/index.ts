import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import viewPatientRoutes from './viewPatientSearch'

import { Services } from '../services'

export default function routes(router: Router, { prisonerSearchService }: Services): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/search-for-a-restricted-patient', viewPatientRoutes())

  return router
}
