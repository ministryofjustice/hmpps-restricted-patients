import express, { Router } from 'express'
import path from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'
import PrisonerSearchService from '../services/prisonerSearchService'

export default function prisonerRoutes({
  prisonerSearchService,
}: {
  prisonerSearchService: PrisonerSearchService
}): Router {
  const router = express.Router()

  router.get(
    '/:prisonerNumber/image',
    asyncMiddleware(async (req, res, next) => {
      prisonerSearchService
        .getPrisonerImage(req.params.prisonerNumber, res.locals.user)
        .then(data => {
          res.type('image/jpeg')
          data.pipe(res)
        })
        .catch(() => {
          const placeHolder = path.join(process.cwd(), '/assets/images/image-missing.jpg')
          res.sendFile(placeHolder)
        })
    }),
  )

  return router
}
