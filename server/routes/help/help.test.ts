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
    roles: [],
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
  it('should load all categories', () => {
    return request(app)
      .get('/help')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = load(res.text)

        expect(getPageHeader($)).toStrictEqual('Restricted patients help')

        expect(getSubHeader($, 'about-restricted-patients-header')).toStrictEqual('About restricted patients')
        expect(getSubHeader($, 'product-info-header')).toStrictEqual('Restricted patients product info')
        expect(getSubHeader($, 'roles-header')).toStrictEqual('Roles')
        expect(getSubHeader($, 'accounts-header')).toStrictEqual('Accounts, access and sign in')
        expect(getSubHeader($, 'operational-issues-header')).toStrictEqual('Operational issues')
      })
  })

  it('should load some help details', () => {
    return request(app)
      .get('/help')
      .expect('Content-Type', /html/)
      .expect(res => {
        const $ = load(res.text)

        expect(getDetail($, 'restricted-patient-definition').attr('open')).toBeFalsy()
        expect(getDetailSummaryText($, 'restricted-patient-definition')).toStrictEqual('A restricted patient is:')
        expect(getDetailText($, 'restricted-patient-definition')).toContain(
          'Someone in hospital who has special restrictions'
        )

        expect(getDetail($, 'sending-patients-back-to-prison').attr('open')).toBeFalsy()
        expect(getDetailSummaryText($, 'sending-patients-back-to-prison')).toStrictEqual(
          'A restricted patient is being sent back to prison - how do we bring them in?'
        )
        expect(getDetailText($, 'sending-patients-back-to-prison')).toContain(
          'Simply book the offender back into NOMIS'
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
