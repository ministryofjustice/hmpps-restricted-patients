import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchService from '../../services/prisonerSearchService'
import PrisonerSearchRoutes from './prisonerSearch'
import PrisonerSelectRoutes from './prisonerSelect'
import AddPatientCompletedRoutes from './addPatientCompleted'
import AddPatientConfirmationRoutes from './addPatientConfirmation'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AgencySearchService from '../../services/agencySearchService'
import HospitalSelectRoutes from './hospitalSelect'
import MigratePrisonerService from '../../services/migratePrisonerService'

export default function addPrisonerRoutes({
  agencySearchService,
  prisonerSearchService,
  migratePrisonerService,
}: {
  prisonerSearchService: PrisonerSearchService
  agencySearchService: AgencySearchService
  migratePrisonerService: MigratePrisonerService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['RESTRICTED_PATIENT_MIGRATION']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerSearch = new PrisonerSearchRoutes()
  const prisonerSelect = new PrisonerSelectRoutes(prisonerSearchService)
  const hospitalSelect = new HospitalSelectRoutes(agencySearchService, prisonerSearchService)
  const addPatientCompleted = new AddPatientCompletedRoutes(prisonerSearchService, agencySearchService)
  const addPatientConfirmation = new AddPatientConfirmationRoutes(
    migratePrisonerService,
    prisonerSearchService,
    agencySearchService,
  )

  get('/search-for-prisoner', prisonerSearch.view)
  post('/search-for-prisoner', prisonerSearch.submit)

  get('/select-prisoner', prisonerSelect.view)
  post('/select-prisoner', prisonerSelect.submit)

  get('/select-hospital', hospitalSelect.view)
  post('/select-hospital', hospitalSelect.submit)

  get('/confirm-add', addPatientConfirmation.view)
  post('/confirm-add', addPatientConfirmation.submit)

  get('/prisoner-added', addPatientCompleted.view)

  return router
}
