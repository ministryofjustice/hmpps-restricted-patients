import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'

import ViewPatientsRoutes from './viewPatients'
import RestrictedPatientSearchRoutes from '../searchPatients/restrictedPatientSearch'

export default function viewPatientsRoutes({
  restrictedPatientSearchService,
}: {
  restrictedPatientSearchService: RestrictedPatientSearchService
}): Router {
  const router = express.Router()

  const viewPatients = new ViewPatientsRoutes(restrictedPatientSearchService)
  const restrictedPatientSearch = new RestrictedPatientSearchRoutes('/view-restricted-patients')

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/search-for-patient', restrictedPatientSearch.view)
  post('/search-for-patient', restrictedPatientSearch.submit)

  get('/', viewPatients.view)
  post('/', viewPatients.submit)

  return router
}
