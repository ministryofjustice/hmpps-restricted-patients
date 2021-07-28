import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import MovePrisonerRoutes from './movePrisoner'

import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default function movePrisonerRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })

  const movePrisoner = new MovePrisonerRoutes(movePrisonerService, prisonerSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/:prisonerNumber', movePrisoner.view)
  post('/:prisonerNumber', movePrisoner.submit)

  return router
}
