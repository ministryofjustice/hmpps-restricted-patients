import { Router } from 'express'

import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import viewPatientsRoutes from './viewPatients'
import removePatientRoutes from './removePatient'
import homepageRoutes from './homepage'
import changeSupportingPrisonRoutes from './changeSupportingPrison'

import addPrisonerRoutes from './addPatient'
import helpRoutes from './help'
import { Services } from '../services'

export default function routes({
  prisonerSearchService,
  restrictedPatientSearchService,
  movePrisonerService,
  removeRestrictedPatientService,
  userService,
  agencySearchService,
  migratePrisonerService,
}: Services): Router {
  const router = Router()
  router.use(
    '/move-to-hospital',
    movePrisonerRoutes({ movePrisonerService, prisonerSearchService, agencySearchService }),
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
    addPrisonerRoutes({ agencySearchService, prisonerSearchService, migratePrisonerService }),
  )
  router.use(
    '/change-supporting-prison',
    changeSupportingPrisonRoutes({
      agencySearchService,
      restrictedPatientSearchService,
      prisonerSearchService,
      movePrisonerService,
    }),
  )
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/help', helpRoutes())
  router.use('/', homepageRoutes({ userService }))

  return router
}
