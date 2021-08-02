import express, { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PatientSearchRoutes from './patientSearch'
import flashMiddleware from '../../middleware/flashMiddleware'
import requestValidationMiddleware from '../../middleware/requestValidationMiddleware'
import SearchForm from '../../@types/SearchForm'

export default function viewPatientRoutes(): Router {
  const router = express.Router()

  const patientSearch = new PatientSearchRoutes()

  router.get('/', flashMiddleware, asyncMiddleware(patientSearch.view))
  router.post(
    '/',
    requestValidationMiddleware(SearchForm, (_, res) => res.internalRedirect('/')),
    asyncMiddleware(patientSearch.submit)
  )

  return router
}
