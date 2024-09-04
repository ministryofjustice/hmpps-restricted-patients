import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchService from '../../services/prisonerSearchService'
import ChangePrisonCompletedRoutes from './changePrisonCompleted'
import ChangePrisonConfirmationRoutes from './changePrisonConfirmation'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AgencySearchService from '../../services/agencySearchService'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonSelectRoutes from './prisonSelect'
import RestrictedPatientSearchRoutes from './patientSearch'
import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'
import RestrictedPatientSelectRoutes from './patientSelect'

export default function changeSupportingPrisonRoutes({
  agencySearchService,
  restrictedPatientSearchService,
  movePrisonerService,
  prisonerSearchService,
}: {
  agencySearchService: AgencySearchService
  restrictedPatientSearchService: RestrictedPatientSearchService
  movePrisonerService: MovePrisonerService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['RESTRICTED_PATIENT_MIGRATION']))

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const patientSearch = new RestrictedPatientSearchRoutes()
  const patientSelect = new RestrictedPatientSelectRoutes(restrictedPatientSearchService)
  const prisonSelect = new PrisonSelectRoutes(agencySearchService, restrictedPatientSearchService)
  const changePrisonCompleted = new ChangePrisonCompletedRoutes(prisonerSearchService, agencySearchService)
  const changePrisonConfirmation = new ChangePrisonConfirmationRoutes(
    movePrisonerService,
    prisonerSearchService,
    agencySearchService,
  )

  get('/search-for-patient', patientSearch.view)
  post('/search-for-patient', patientSearch.submit)

  get('/select-patient', patientSelect.view)
  post('/select-patient', patientSelect.submit)

  get('/select-prison', prisonSelect.view)
  post('/select-prison', prisonSelect.submit)

  get('/', changePrisonConfirmation.view)
  post('/', changePrisonConfirmation.submit)

  get('/prisoner-changed', changePrisonCompleted.view)

  return router
}
