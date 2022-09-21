import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchService from '../../services/prisonerSearchService'
import PrisonerSearchRoutes from './prisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import HospitalSearchService from '../../services/hospitalSearchService'
import HospitalSelectRoutes from './hospitalSelect'

export default function addPrisonerRoutes({
  hospitalSearchService,
  prisonerSearchService,
}: {
  prisonerSearchService: PrisonerSearchService
  hospitalSearchService: HospitalSearchService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['RESTRICTED_PATIENT_MIGRATION']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerSearch = new PrisonerSearchRoutes()
  const prisonerSelect = new PrisonerSelectRoutes(prisonerSearchService)
  const hospitalSelect = new HospitalSelectRoutes(hospitalSearchService, prisonerSearchService)

  get('/search-for-prisoner', prisonerSearch.view)
  post('/search-for-prisoner', prisonerSearch.submit)

  get('/select-prisoner', prisonerSelect.view)
  post('/select-prisoner', prisonerSelect.submit)

  get('/select-hospital', hospitalSelect.view)
  post('/select-hospital', hospitalSelect.submit)

  return router
}
