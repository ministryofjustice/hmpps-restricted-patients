import express, { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import PrisonerSearchRoutes from './prisonerSearch'

export default function MovingPrisonerRoutes(): Router {
  const router = express.Router()

  const prisonerSearch = new PrisonerSearchRoutes()

  const get = (path, handler) => router.get(path, asyncMiddleware(handler))
  const post = (path, handler) => router.post(path, asyncMiddleware(handler))

  get('/', prisonerSearch.view)
  post('/', prisonerSearch.submit)

  return router
}
