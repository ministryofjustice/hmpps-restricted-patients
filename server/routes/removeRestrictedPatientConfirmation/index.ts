import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RemoveRestrictedPatientConfirmationRoutes from './removeRestrictedPatientConfirmation'

import RemoveRestrictedPatientService from '../../services/removeRestrictedPatientService'

export default function removeRestrictedPatientConfirmationRoutes({
  removeRestrictedPatientService,
}: {
  removeRestrictedPatientService: RemoveRestrictedPatientService
}): Router {
  const router = express.Router({ mergeParams: true })

  const removeRestrictedPatientConfirmation = new RemoveRestrictedPatientConfirmationRoutes(
    removeRestrictedPatientService
  )

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/:prisonerNumber', removeRestrictedPatientConfirmation.view)
  post('/:prisonerNumber', removeRestrictedPatientConfirmation.submit)

  return router
}
