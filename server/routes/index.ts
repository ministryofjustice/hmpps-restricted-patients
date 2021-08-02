import type { Router } from 'express'

import prisonerSearchRoutes from './prisonerSearch'
import prisonerSelectRoutes from './prisonerSelect'
import prisonerRoutes from './prisonerRoutes'
import movePrisonerRoutes from './movePrisoner'
import viewPatientSearchRoutes from './viewPatientSearch'
import viewPatientsRoutes from './viewPatients'

import { Services } from '../services'
import {
  removeRestrictedPatientsSearchResultRoutes,
  searchForARestrictedPatientRoutes,
} from './removeRestrictedPatient'
import { RemoveRestrictedPatientPath } from './removeRestrictedPatient/constants'

export default function routes(
  router: Router,
  { prisonerSearchService, restrictedPatientSearchService, movePrisonerService }: Services
): Router {
  router.use('/search-for-prisoner', prisonerSearchRoutes())
  router.use('/select-prisoner', prisonerSelectRoutes({ prisonerSearchService }))
  router.use('/prisoner', prisonerRoutes({ prisonerSearchService }))
  router.use('/move-to-hospital', movePrisonerRoutes({ movePrisonerService, prisonerSearchService }))
  router.use('/search-for-restricted-patient', viewPatientSearchRoutes())
  router.use('/viewing-restricted-patients', viewPatientsRoutes({ restrictedPatientSearchService }))
  router.use(
    RemoveRestrictedPatientPath.DisplaySearch,
    searchForARestrictedPatientRoutes({ restrictedPatientSearchService })
  )
  router.use(
    RemoveRestrictedPatientPath.SearchResults,
    removeRestrictedPatientsSearchResultRoutes({ restrictedPatientSearchService })
  )

  return router
}
