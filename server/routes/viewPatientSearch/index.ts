import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PatientSearchRoutes from './patientSearch'

export default function viewPatientRoutes(searchResultsPath: string): Router {
  const router = express.Router()

  const patientSearch = new PatientSearchRoutes(searchResultsPath)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', patientSearch.view)
  post('/', patientSearch.submit)

  return router
}
