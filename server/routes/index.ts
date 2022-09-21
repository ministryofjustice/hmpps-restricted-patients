import type { Router } from 'express'

import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import viewPatientsRoutes from './viewPatients'
import removePatientRoutes from './removePatient'
import homepageRoutes from './homepage'

import { Services } from '../services'
import addPrisonerRoutes from './addPatient'

export default function routes(
  router: Router,
  {
    prisonerSearchService,
    restrictedPatientSearchService,
    movePrisonerService,
    removeRestrictedPatientService,
    userService,
    hospitalSearchService,
    migratePrisonerService,
  }: Services
): Router {
  router.use(
    '/move-to-hospital',
    movePrisonerRoutes({ movePrisonerService, prisonerSearchService, hospitalSearchService })
  )
  router.use('/view-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))
  router.use(
    '/remove-from-restricted-patients',
    removePatientRoutes({
      removeRestrictedPatientService,
      restrictedPatientSearchService,
      prisonerSearchService,
    })
  )
  router.use(
    '/add-restricted-patient',
    addPrisonerRoutes({ hospitalSearchService, prisonerSearchService, migratePrisonerService })
  )
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/', homepageRoutes({ userService }))

  return router
}
