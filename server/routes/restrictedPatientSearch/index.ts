import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RestrictedPatientSearchRoutes from './restrictedPatientSearch'

export default function restrictedPatientSearchRoutes(searchResultsPath: string): Router {
  const router = express.Router()

  const restrictedPatientSearch = new RestrictedPatientSearchRoutes(searchResultsPath)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', restrictedPatientSearch.view)
  post('/', restrictedPatientSearch.submit)

  return router
}
