import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import MovePrisonerRoutes from './movePrisoner'

import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import MovePrisonerConfirmationRoutes from './movePrisonerConfirmation'
import MovePrisonerCompletedRoutes from './movePrisonerCompleted'
import PrisonerSearchRoutes from './prisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'

export default function movePrisonerRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['TRANSFER_RESTRICTED_PATIENT']))

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

  get('/select-prisoner', movePrisoner.view)

  get('/confirm-move', movePrisonerConfirmation.view)
  post('/confirm-move', movePrisonerConfirmation.submit)

  get('/prisoner-moved-to-hospital', movePrisonerCompleted.view)

  get('/', movePrisoner.view)
  post('/', movePrisoner.submit)

  return router
}
