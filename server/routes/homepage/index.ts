import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

import HomepageRoutes from './homepage'
import UserService from '../../services/userService'

export default function homepageRoutes({ userService }: { userService: UserService }): Router {
  const router = express.Router()

  const homepage = new HomepageRoutes(userService)

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', homepage.view)
  return router
}
