import type { Router } from 'express'

import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import restrictedPatientSearchRoutes from './restrictedPatientSearch'
import viewPatientsRoutes from './viewPatients'
import restrictedPatientSelectRoutes from './restrictedPatientSelect'
import removeRestrictedPatientConfirmationRoutes from './removeRestrictedPatientConfirmation'
import removeRestrictedPatientCompletedRoutes from './removeRestrictedPatientCompleted'
import homepageRoutes from './homepage'

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
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))

  router.use('/move-to-hospital', movePrisonerRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/view-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))

  router.use('/search-for-a-restricted-patient', restrictedPatientSearchRoutes('/select-restricted-patient'))
  router.use('/select-restricted-patient', restrictedPatientSelectRoutes({ restrictedPatientSearchService }))
  router.use(
    '/remove-from-restricted-patients',
    removeRestrictedPatientConfirmationRoutes({ removeRestrictedPatientService })
  )
  router.use('/person-removed', removeRestrictedPatientCompletedRoutes({ prisonerSearchService }))
  router.use('/', homepageRoutes({ userService }))

  return router
}
