import 'reflect-metadata'
import { Express } from 'express'
import request from 'supertest'
import { load, CheerioAPI } from 'cheerio'
import appWithAllRoutes from '../testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    production: false,
    services: {},
    roles: ['SEARCH_RESTRICTED_PATIENT'], // TODO don't need this?
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

function getPageHeader(c: CheerioAPI) {
  return c('h1.govuk-heading-l').text()
}

function getSubHeader(c: CheerioAPI, headerName: string) {
  return c(`h2[data-qa=${headerName}].govuk-heading-m`).text()
}

function getDetail(c: CheerioAPI, sectionId: string) {
  return c(`details#${sectionId}.govuk-details`)
}

function getDetailSummaryText(c: CheerioAPI, sectionId: string) {
  return getDetail(c, sectionId).find('span.govuk-details__summary-text').text().trim()
}

function getDetailText(c: CheerioAPI, sectionId: string) {
  return getDetail(c, sectionId).find('div.govuk-details__text').text()
}

describe('GET /help', () => {
  it('should load the help page', () => {
    return request(app)
      .get('/help')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = load(res.text)

        expect(getPageHeader($)).toStrictEqual('Restricted patients help')

        expect(getSubHeader($, 'about-header')).toStrictEqual('About restricted patients')
        expect(getDetail($, 'restricted-patient-definition').attr('open')).toBeFalsy()
        expect(getDetailSummaryText($, 'restricted-patient-definition')).toStrictEqual('A Restricted Patient is:')
        expect(getDetailText($, 'restricted-patient-definition')).toContain(
          'Someone in hospital who has special restrictions'
        )

        expect(getSubHeader($, 'issues-header')).toStrictEqual('Operational issues')
        expect(getDetail($, 'sending-patients-back-to-prison').attr('open')).toBeFalsy()
        expect(getDetailSummaryText($, 'sending-patients-back-to-prison')).toStrictEqual(
          'An RP is being sent back to prison - how do we bring them in?'
        )
        expect(getDetailText($, 'sending-patients-back-to-prison')).toContain(
          'Simply book the offender back in on NOMIS'
        )
      })
  })

  it('should open requested help section', () => {
    return request(app)
      .get('/help?section=sending-patients-back-to-prison')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = load(res.text)

        expect(getDetail($, 'sending-patients-back-to-prison').attr('open')).toBeTruthy()
      })
  })
})
