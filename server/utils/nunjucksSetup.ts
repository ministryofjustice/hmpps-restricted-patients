/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { initialiseName, possessive } from './utils'
import config from '../config'
import logger from '../../logger'
import { FormError } from '../@types/template'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Manage restricted patients'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  njkEnv.addFilter('findError', (array: FormError[], formFieldId: string) => {
    const item = array.find(error => error.href === `#${formFieldId}`)
    if (item) {
      return {
        text: item.text,
      }
    }
    return null
  })

  njkEnv.addGlobal('dpsUrl', config.dpsUrl)
  njkEnv.addGlobal('prisonerProfileUrl', config.prisonerProfileUrl)
  njkEnv.addGlobal('authUrl', config.apis.hmppsAuth.url)
  njkEnv.addFilter('possessive', possessive)
}
