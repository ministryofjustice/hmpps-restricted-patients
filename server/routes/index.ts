import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import viewPatientSearchRoutes from './viewPatientSearch'
import viewPatientsRoutes from './viewPatients'

import { Services } from '../services'

export default function routes(
  router: Router,
  { prisonerSearchService, restrictedPatientSearchService }: Services
): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/search-for-a-restricted-patient', viewPatientSearchRoutes())
  router.use('/viewing-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))

  return router
}
