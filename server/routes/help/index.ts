import express, { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HelpRoutes from './help'
import AboutHelp from './aboutHelp'
import IssuesHelp from './issuesHelp'

export type HelpSection = {
  id: string
  section: 'about-restricted-patients' | 'operational-issues'
  heading: string
  content: string
}

export default function helpRoutes(): Router {
  const router = express.Router()

  const helpPage = new HelpRoutes(new AboutHelp().helpItems(), new IssuesHelp().helpItems())

  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', helpPage.view)
  return router
}
