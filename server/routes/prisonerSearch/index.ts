import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchRoutes from './prisonerSearch'

import PrisonerSearchService from '../../services/prisonerSearchService'

export default function movingPrisonerRoutes({
  prisonerSearchService,
}: {
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router()

  const prisonerSearch = new PrisonerSearchRoutes()

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', prisonerSearch.view)
  post('/', prisonerSearch.submit)

  get(
    '/results/:searchTerm',
    asyncMiddleware(async (req, res, next) => {
      const { searchTerm } = req.params

      prisonerSearchService
        .search({ searchTerm, ...res.locals.user }, res.locals.user)
        .then(data => {
          res.json(data)
        })
        .catch(error => {
          res.send(error)
        })
    })
  )

  return router
}
