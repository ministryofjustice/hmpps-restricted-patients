import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import movePrisonerConfirmationRoutes from './movePrisonerConfirmation'
import movePrisonerCompletedRoutes from './movePrisonerCompleted'
import restrictedPatientSearchRoutes from './restrictedPatientSearch'
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
  router.use('/confirm-move', movePrisonerConfirmationRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/prisoner-moved-to-hospital', movePrisonerCompletedRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/search-for-restricted-patient', restrictedPatientSearchRoutes('/viewing-restricted-patients'))
  router.use('/search-for-a-restricted-patient', restrictedPatientSearchRoutes('/select-a-restricted-patient'))
  router.use('/viewing-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))

  return router
}
