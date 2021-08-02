import express, { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'

import ViewPatientsRoutes from './viewPatients'
import flashMiddleware from '../../middleware/flashMiddleware'
import requestValidationMiddleware from '../../middleware/requestValidationMiddleware'
import SearchForm from '../../@types/SearchForm'

export default function viewPatientsRoutes({
  restrictedPatientSearchService,
}: {
  restrictedPatientSearchService: RestrictedPatientSearchService
}): Router {
  const router = express.Router()

  const viewPatients = new ViewPatientsRoutes(restrictedPatientSearchService)

  router.get('/', flashMiddleware, asyncMiddleware(viewPatients.view))
  router.post(
    '/',
    requestValidationMiddleware(SearchForm, (_, res) => res.redirect('/search-for-restricted-patient')),
    asyncMiddleware(viewPatients.submit)
  )

  return router
}
