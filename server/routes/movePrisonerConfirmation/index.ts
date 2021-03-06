import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import MovePrisonerConfirmationRoutes from './movePrisonerConfirmation'

import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default function movePrisonerConfirmationRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })

  const movePrisonerConfirmation = new MovePrisonerConfirmationRoutes(movePrisonerService, prisonerSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/:prisonerNumber/:hospitalId', movePrisonerConfirmation.view)
  post('/:prisonerNumber/:hospitalId', movePrisonerConfirmation.submit)

  return router
}
