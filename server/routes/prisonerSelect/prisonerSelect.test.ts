import 'reflect-metadata'
import { Express } from 'express'
import request from 'supertest'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'
import appWithAllRoutes from '../testutils/appSetup'

jest.mock('../../services/prisonerSearchService')

const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false }, { prisonerSearchService })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe.skip('GET /select-prisoner', () => {
  describe('with results', () => {
    beforeEach(() => {
      prisonerSearchService.search.mockResolvedValue([
        {
          alerts: [
            { alertType: 'T', alertCode: 'TCPA' },
            { alertType: 'X', alertCode: 'XCU' },
          ],
          cellLocation: '1-2-015',
          displayName: 'Smith, John',
          formattedAlerts: [
            {
              alertCodes: ['XCU'],
              classes: 'alert-status alert-status--controlled-unlock',
              label: 'Controlled unlock',
            },
          ],
          prisonerNumber: 'A1234AA',
          prisonName: 'HMP Moorland',
        } as PrisonerSearchSummary,
      ])
    })

    it('should load the search for a prisoner page', () => {
      return request(app)
        .get('/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Select a prisoner')
          expect(res.text).toContain(
            '<img src="/prisoner/A1234AA/image" alt="Photograph of Smith, John" class="results-table__image" />'
          )
          expect(res.text).toContain('Smith, John')
          expect(res.text).toContain('1-2-015')
          expect(res.text).toContain('Controlled unlock')
          expect(res.text).toContain(
            '<a href="/move-to-hospital/A1234AA" class="govuk-link" data-test="prisoner-move-to-hospital-link"><span class="govuk-visually-hidden">Smith, John - </span>Move to a hospital</a>'
          )
        })
    })
  })

  describe('without results', () => {
    beforeEach(() => {
      prisonerSearchService.search.mockResolvedValue([])
    })

    it('should load the search for a prisoner page', () => {
      return request(app)
        .get('/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Select a prisoner')
          expect(res.text).toContain(
            'There are no results for the name or number you have entered. You can search again.'
          )
        })
    })
  })
})