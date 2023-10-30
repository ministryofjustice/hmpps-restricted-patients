import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'
import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
  const scriptSrc = [
    "'self'",
    (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
    'code.jquery.com',
    '*.googletagmanager.com',
    'www.google-analytics.com',
    "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
  ]
  const styleSrc = ["'self'", 'code.jquery.com', "'unsafe-inline'"]
  const imgSrc = ["'self'", '*.googletagmanager.com', '*.google-analytics.com', 'code.jquery.com']
  const fontSrc = ["'self'"]

  if (config.apis.frontendComponents.url) {
    scriptSrc.push(config.apis.frontendComponents.url)
    styleSrc.push(config.apis.frontendComponents.url)
    imgSrc.push(config.apis.frontendComponents.url)
    fontSrc.push(config.apis.frontendComponents.url)
  }

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc,
          styleSrc,
          fontSrc,
          imgSrc,
          connectSrc: ["'self'", '*.googletagmanager.com', '*.google-analytics.com', '*.analytics.google.com'],
          formAction: ["'self'", config.dpsUrl],
        },
      },
    }),
  )
  return router
}
