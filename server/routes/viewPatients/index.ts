import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'

import ViewPatientsRoutes from './viewPatients'

export default function viewPatientsRoutes({
  restrictedPatientSearchService,
}: {
  restrictedPatientSearchService: RestrictedPatientSearchService
}): Router {
  const router = express.Router()

  const viewPatients = new ViewPatientsRoutes(restrictedPatientSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', viewPatients.view)
  post('/', viewPatients.submit)

  return router
}
