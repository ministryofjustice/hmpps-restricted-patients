import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import HospitalSelectRoutes from './hospitalSelect'
import MovePrisonerService from '../../services/movePrisonerService'
import AgencySearchService from '../../services/agencySearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import MovePrisonerConfirmationRoutes from './movePrisonerConfirmation'
import MovePrisonerCompletedRoutes from './movePrisonerCompleted'
import PrisonerSearchRoutes from './movePrisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'

export default function movePrisonerRoutes({
  movePrisonerService,
  prisonerSearchService,
  agencySearchService,
}: {
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
  agencySearchService: AgencySearchService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['TRANSFER_RESTRICTED_PATIENT']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerSearch = new PrisonerSearchRoutes()
  const prisonerSelect = new PrisonerSelectRoutes(prisonerSearchService)
  const movePrisoner = new HospitalSelectRoutes(agencySearchService, prisonerSearchService)
  const movePrisonerConfirmation = new MovePrisonerConfirmationRoutes(
    movePrisonerService,
    prisonerSearchService,
    agencySearchService,
  )
  const movePrisonerCompleted = new MovePrisonerCompletedRoutes(prisonerSearchService, agencySearchService)

  get('/search-for-prisoner', prisonerSearch.view)
  post('/search-for-prisoner', prisonerSearch.submit)

  get('/select-prisoner', prisonerSelect.view)
  post('/select-prisoner', prisonerSelect.submit)

  get('/select-hospital', movePrisoner.view)
  post('/select-hospital', movePrisoner.submit)

  get('/confirm-move', movePrisonerConfirmation.view)
  post('/confirm-move', movePrisonerConfirmation.submit)

  get('/prisoner-moved-to-hospital', movePrisonerCompleted.view)

  return router
}
