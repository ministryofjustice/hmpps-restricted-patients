import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import MovePrisonerCompletedRoutes from './movePrisonerCompleted'

import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default function movePrisonerCompletedRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })

  const movePrisonerConfirmation = new MovePrisonerCompletedRoutes(movePrisonerService, prisonerSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/:prisonerNumber/:hospitalId', movePrisonerConfirmation.view)

  return router
}
