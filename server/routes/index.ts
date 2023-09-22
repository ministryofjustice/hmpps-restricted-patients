import { Router } from 'express'

import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import viewPatientsRoutes from './viewPatients'
import removePatientRoutes from './removePatient'
import homepageRoutes from './homepage'

import addPrisonerRoutes from './addPatient'
import helpRoutes from './help'
import { Services } from '../services'

export default function routes({
  prisonerSearchService,
  restrictedPatientSearchService,
  movePrisonerService,
  removeRestrictedPatientService,
  userService,
  hospitalSearchService,
  migratePrisonerService,
}: Services): Router {
  const router = Router()
  router.use(
    '/move-to-hospital',
    movePrisonerRoutes({ movePrisonerService, prisonerSearchService, hospitalSearchService }),
  )
  router.use('/view-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))
  router.use(
    '/remove-from-restricted-patients',
    removePatientRoutes({
      removeRestrictedPatientService,
      restrictedPatientSearchService,
      prisonerSearchService,
    }),
  )
  router.use(
    '/add-restricted-patient',
    addPrisonerRoutes({ hospitalSearchService, prisonerSearchService, migratePrisonerService }),
  )
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/help', helpRoutes())
  router.use('/', homepageRoutes({ userService }))

  return router
}
