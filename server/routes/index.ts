import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import movePrisonerConfirmationRoutes from './movePrisonerConfirmation'
import movePrisonerCompletedRoutes from './movePrisonerCompleted'
import restrictedPatientSearchRoutes from './restrictedPatientSearch'
import viewPatientsRoutes from './viewPatients'
import restrictedPatientSelectRoutes from './restrictedPatientSelect'
import removeRestrictedPatientConfirmationRoutes from './removeRestrictedPatientConfirmation'
import removeRestrictedPatientCompletedRoutes from './removeRestrictedPatientCompleted'
import homepageRoutes from './homepage'
import { raiseAnalyticsEvent } from '../raiseAnalyticsEvent'

import { Services } from '../services'

export default function routes(
  router: Router,
  {
    prisonerSearchService,
    restrictedPatientSearchService,
    movePrisonerService,
    removeRestrictedPatientService,
    userService,
  }: Services
): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/move-to-hospital', movePrisonerRoutes({ movePrisonerService, prisonerSearchService }))
  router.use(
    '/confirm-move',
    movePrisonerConfirmationRoutes({ movePrisonerService, prisonerSearchService, raiseAnalyticsEvent })
  )
  router.use('/prisoner-moved-to-hospital', movePrisonerCompletedRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/search-for-restricted-patient', restrictedPatientSearchRoutes('/viewing-restricted-patients'))
  router.use('/search-for-a-restricted-patient', restrictedPatientSearchRoutes('/select-restricted-patient'))
  router.use('/viewing-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))
  router.use('/select-restricted-patient', restrictedPatientSelectRoutes({ restrictedPatientSearchService }))
  router.use(
    '/remove-from-restricted-patients',
    removeRestrictedPatientConfirmationRoutes({ removeRestrictedPatientService, raiseAnalyticsEvent })
  )
  router.use('/person-removed', removeRestrictedPatientCompletedRoutes({ prisonerSearchService }))
  router.use('/', homepageRoutes({ userService }))

  return router
}
