import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import MovePrisonerRoutes from './movePrisoner'

import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import MovePrisonerConfirmationRoutes from './movePrisonerConfirmation'
import MovePrisonerCompletedRoutes from './movePrisonerCompleted'
import PrisonerSearchRoutes from './prisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'

export default function movePrisonerRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerSearch = new PrisonerSearchRoutes()
  const prisonerSelect = new PrisonerSelectRoutes(prisonerSearchService)
  const movePrisoner = new MovePrisonerRoutes(movePrisonerService, prisonerSearchService)
  const movePrisonerConfirmation = new MovePrisonerConfirmationRoutes(movePrisonerService, prisonerSearchService)
  const movePrisonerCompleted = new MovePrisonerCompletedRoutes(movePrisonerService, prisonerSearchService)

  get('/search-for-prisoner', prisonerSearch.view)
  post('/search-for-prisoner', prisonerSearch.submit)

  get('/select-prisoner', prisonerSelect.view)
  post('/select-prisoner', prisonerSelect.submit)

  get('/select-prisoner/:prisonerNumber', movePrisoner.view)

  get('/confirm-move/:prisonerNumber/:hospitalId', movePrisonerConfirmation.view)
  post('/confirm-move/:prisonerNumber/:hospitalId', movePrisonerConfirmation.submit)

  get('/prisoner-moved-to-hospital/:prisonerNumber/:hospitalId', movePrisonerCompleted.view)

  get('/:prisonerNumber', movePrisoner.view)
  post('/:prisonerNumber', movePrisoner.submit)

  return router
}
