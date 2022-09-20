import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import RemoveRestrictedPatientConfirmationRoutes from './removeRestrictedPatientConfirmation'

import RemoveRestrictedPatientService from '../../services/removeRestrictedPatientService'
import RestrictedPatientSearchRoutes from './removeRestrictedPatientSearch'
import RestrictedPatientSelectRoutes from './restrictedPatientSelect'
import RemoveRestrictedPatientCompletedRoutes from './removeRestrictedPatientCompleted'
import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'

export default function removePatientRoutes({
  removeRestrictedPatientService,
  restrictedPatientSearchService,
  prisonerSearchService,
}: {
  removeRestrictedPatientService: RemoveRestrictedPatientService
  restrictedPatientSearchService: RestrictedPatientSearchService
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router({ mergeParams: true })
  router.use(authorisationMiddleware(true, ['REMOVE_RESTRICTED_PATIENT']))

  const confirmation = new RemoveRestrictedPatientConfirmationRoutes(removeRestrictedPatientService)
  const search = new RestrictedPatientSearchRoutes()
  const select = new RestrictedPatientSelectRoutes(restrictedPatientSearchService)
  const completed = new RemoveRestrictedPatientCompletedRoutes(prisonerSearchService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/search-for-patient', search.view)
  post('/search-for-patient', search.submit)

  get('/select-patient', select.view)
  post('/select-patient', select.submit)

  get('/patient-removed', completed.view)

  get('/', confirmation.view)
  post('/', confirmation.submit)

  return router
}
