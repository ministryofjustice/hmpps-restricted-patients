import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchService from '../../services/prisonerSearchService'
import PrisonerSearchRoutes from './prisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import MovePrisonerService from '../../services/movePrisonerService'
import MovePrisonerRoutes from './hospitalSelect'

export default function addPrisonerRoutes({
  movePrisonerService,
  prisonerSearchService,
}: {
  prisonerSearchService: PrisonerSearchService
  movePrisonerService: MovePrisonerService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['RESTRICTED_PATIENT_MIGRATION']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerSearch = new PrisonerSearchRoutes()
  const prisonerSelect = new PrisonerSelectRoutes(prisonerSearchService)
  const hospitalSelect = new MovePrisonerRoutes(movePrisonerService, prisonerSearchService)

  get('/search-for-prisoner', prisonerSearch.view)
  post('/search-for-prisoner', prisonerSearch.submit)

  get('/select-prisoner', prisonerSelect.view)
  post('/select-prisoner', prisonerSelect.submit)

  get('/select-hospital', hospitalSelect.view)
  post('/select-hospital', hospitalSelect.submit)

  return router
}
