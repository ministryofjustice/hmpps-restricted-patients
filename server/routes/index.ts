import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import viewPatientSearchRoutes from './viewPatientSearch'
import viewPatientsRoutes from './viewPatients'

import { Services } from '../services'

export default function routes(
  router: Router,
  { prisonerSearchService, restrictedPatientSearchService, movePrisonerService }: Services
): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/move-to-hospital', movePrisonerRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/search-for-restricted-patient', viewPatientSearchRoutes('/viewing-restricted-patients'))
  router.use('/search-for-a-restricted-patient', viewPatientSearchRoutes('/select-a-restricted-patient'))
  router.use('/viewing-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))

  return router
}
