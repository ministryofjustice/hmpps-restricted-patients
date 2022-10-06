import 'reflect-metadata'
import { Express } from 'express'
import request from 'supertest'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'
import appWithAllRoutes, { mockJwtDecode } from '../testutils/appSetup'

jest.mock('../../services/prisonerSearchService')

const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    production: false,
    services: { prisonerSearchService },
    roles: ['RESTRICTED_PATIENT_MIGRATION'],
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /select-prisoner', () => {
  describe('with results', () => {
    beforeEach(() => {
      prisonerSearchService.search.mockResolvedValue([
        {
          alerts: [
            { alertType: 'T', alertCode: 'TCPA' },
            { alertType: 'X', alertCode: 'XCU' },
          ],
          locationDescription: 'Outside - released from Doncaster to Psychiatric Hospital',
          displayName: 'Smith, John',
          formattedAlerts: [
            {
              alertCodes: ['XCU'],
              classes: 'alert-status alert-status--controlled-unlock',
              label: 'Controlled unlock',
            },
          ],
          prisonerNumber: 'A1234AA',
          lastMovementTypeCode: 'REL',
          lastMovementReasonCode: 'HP',
          restrictedPatient: false,
          indeterminateSentence: true,
          recall: false,
        } as PrisonerSearchSummary,
        {
          alerts: [],
          locationDescription: 'Outside - released from Doncaster - discharged to NGH',
          displayName: 'Excluded - already restricted patient',
          formattedAlerts: [],
          prisonerNumber: 'A1234AB',
          lastMovementTypeCode: 'REL',
          lastMovementReasonCode: 'HP',
          restrictedPatient: true,
          indeterminateSentence: true,
          recall: false,
        } as PrisonerSearchSummary,
      ])
    })

    it('should load the search for a prisoner page', () => {
      return request(app)
        .get('/add-restricted-patient/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Smith, John')
          expect(res.text).not.toContain('Smith, James')
        })
    })

    it('should exclude restricted patients and not released to hospital', () => {
      return request(app)
        .get('/add-restricted-patient/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Select a prisoner')
          expect(res.text).toContain('<p class="align-right"><strong>People listed:</strong> 1</p>')
          expect(res.text).toContain(
            '<img src="/prisoner/A1234AA/image" alt="Photograph of Smith, John" class="results-table__image" />'
          )
          expect(res.text).toContain('Smith, John')
          expect(res.text).toContain('Outside - released from Doncaster')
          expect(res.text).toContain('Controlled unlock')
          expect(res.text).toContain(
            '<a href="/add-restricted-patient/select-hospital?prisonerNumber=A1234AA&journeyStartUrl=/add-restricted-patient/select-prisoner?searchTerm=Smith" class="govuk-link" data-test="prisoner-add-restricted-patient-link"><span class="govuk-visually-hidden">Smith, John - </span>Add to restricted patients</a>'
          )
        })
    })

    it('should render not found page if user missing privileges', () => {
      mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
      return request(app)
        .get('/add-restricted-patient/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })
  })

  describe('without results', () => {
    beforeEach(() => {
      prisonerSearchService.search.mockResolvedValue([])
    })

    it('should load the search for a prisoner page', () => {
      return request(app)
        .get('/add-restricted-patient/select-prisoner?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Select a prisoner')
          expect(res.text).toContain('There are no results for the details you have entered.')
        })
    })
  })
})

describe('POST /select-prisoner', () => {
  it('should redirect to select prisoner page with the correct search text', () => {
    return request(app)
      .post('/add-restricted-patient/select-prisoner')
      .send({ searchTerm: 'Smith' })
      .expect('Location', '/add-restricted-patient/select-prisoner?searchTerm=Smith')
  })

  it('should render validation messages', () => {
    return request(app)
      .post('/add-restricted-patient/select-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Error: Select a prisoner')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter a prisoner’s name or number')
      })
  })

  it('should render not found page if user missing privileges', () => {
    mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
    return request(app)
      .post('/add-restricted-patient/select-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})
