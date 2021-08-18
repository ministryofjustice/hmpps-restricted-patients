import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RemoveRestrictedPatientCompletedRoutes from './removeRestrictedPatientCompleted'

import PrisonerSearchService from '../../services/prisonerSearchService'

export default function movePrisonerCompletedRoutes({
  prisonerSearchService,
}: {
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })

  const removeRestrictedPatientCompleted = new RemoveRestrictedPatientCompletedRoutes(prisonerSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/:prisonerNumber', removeRestrictedPatientCompleted.view)

  return router
}
