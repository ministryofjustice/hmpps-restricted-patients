import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'

import RestrictedPatientSelectRoutes from './restrictedPatientSelect'

function restrictedPatientSelectRoutes({
  restrictedPatientSearchService,
}: {
  restrictedPatientSearchService: RestrictedPatientSearchService
}): Router {
  const router = express.Router()

  const restrictedPatientSelect = new RestrictedPatientSelectRoutes(restrictedPatientSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', restrictedPatientSelect.view)
  post('/', restrictedPatientSelect.submit)

  return router
}

export default restrictedPatientSelectRoutes
