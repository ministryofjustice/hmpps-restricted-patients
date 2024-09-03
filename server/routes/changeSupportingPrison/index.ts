import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchService from '../../services/prisonerSearchService'
import ChangePrisonCompletedRoutes from './changePrisonCompleted'
import ChangePrisonConfirmationRoutes from './changePrisonConfirmation'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AgencySearchService from '../../services/agencySearchService'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonSelectRoutes from './prisonSelect'

export default function changeSupportingPrisonRoutes({
  agencySearchService,
  prisonerSearchService,
  movePrisonerService,
}: {
  prisonerSearchService: PrisonerSearchService
  agencySearchService: AgencySearchService
  movePrisonerService: MovePrisonerService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['RESTRICTED_PATIENT_MIGRATION']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonSelect = new PrisonSelectRoutes(agencySearchService, prisonerSearchService)
  const changePrisonCompleted = new ChangePrisonCompletedRoutes(prisonerSearchService, agencySearchService)
  const changePrisonConfirmation = new ChangePrisonConfirmationRoutes(
    movePrisonerService,
    prisonerSearchService,
    agencySearchService,
  )

  get('/select-prison', prisonSelect.view)
  post('/select-prison', prisonSelect.submit)

  get('/confirm-change', changePrisonConfirmation.view)
  post('/confirm-change', changePrisonConfirmation.submit)

  get('/prisoner-changed', changePrisonCompleted.view)

  return router
}
