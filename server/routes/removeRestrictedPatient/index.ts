import { Router } from 'express'
import flashMiddleware from '../../middleware/flashMiddleware'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import requestValidationMiddleware from '../../middleware/requestValidationMiddleware'
import SearchForm from '../../@types/SearchForm'
import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'
import RemoveRestrictedPatientRoutes from './RemoveRestrictedPatientRoutes'
import { RemoveRestrictedPatientPath } from './constants'

type Dependencies = { restrictedPatientSearchService: RestrictedPatientSearchService }

export const searchForARestrictedPatientRoutes = (
  { restrictedPatientSearchService }: Dependencies,
  router: Router = Router()
): Router => {
  const routes = new RemoveRestrictedPatientRoutes(restrictedPatientSearchService)
  router.get('/', flashMiddleware, asyncMiddleware(routes.displaySearch))
  return router
}

export const removeRestrictedPatientsSearchResultRoutes = (
  { restrictedPatientSearchService }: Dependencies,
  router: Router = Router()
): Router => {
  const routes = new RemoveRestrictedPatientRoutes(restrictedPatientSearchService)
  router.post(
    '/',
    requestValidationMiddleware(SearchForm, (_, res) => res.redirect(RemoveRestrictedPatientPath.DisplaySearch)),
    asyncMiddleware(routes.searchFormRedirect)
  )
  router.get('/', asyncMiddleware(routes.displaySearchResults))
  return router
}
