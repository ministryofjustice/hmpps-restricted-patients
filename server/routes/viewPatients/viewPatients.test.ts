import 'reflect-metadata'
import { Express } from 'express'
import request from 'supertest'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'
import appWithAllRoutes from '../testutils/appSetup'

jest.mock('../../services/restrictedPatientSearchService')

const restrictedPatientSearchService = new RestrictedPatientSearchService(
  null
) as jest.Mocked<RestrictedPatientSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false }, { restrictedPatientSearchService })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /viewing-restricted-patients', () => {
  describe('with results', () => {
    beforeEach(() => {
      restrictedPatientSearchService.search.mockResolvedValue([
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
          supportingPrisonId: 'DNI',
          dischargedHospitalId: 'YEWTHO',
          dischargedHospitalDescription: 'Yew Trees',
          dischargeDate: '2021-06-08',
          dischargeDetails: 'Psychiatric Hospital Discharge to Yew Trees',
        } as RestrictedPatientSearchSummary,
      ])
    })

    it('should load the viewing rstricted patients page', () => {
      return request(app)
        .get('/viewing-restricted-patients?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Viewing restricted patients')
          expect(res.text).toContain('<p class="align-right"><strong>People listed:</strong> 1</p>')
          expect(res.text).toContain(
            '<img src="/prisoner/A1234AA/image" alt="Photograph of Smith, John" class="results-table__image" />'
          )
          expect(res.text).toContain('Smith, John')
          expect(res.text).toContain('Yew Trees')
          expect(res.text).toContain(
            '<a href="http://localhost:3002/prisoner/A1234AA/add-case-note" class="govuk-link" data-test="patient-add-case-note-link"><span class="govuk-visually-hidden">Smith, John - </span>Add a case note</a>'
          )
        })
    })
  })

  describe('without results', () => {
    beforeEach(() => {
      restrictedPatientSearchService.search.mockResolvedValue([])
    })

    it('should load the search for a patient page', () => {
      return request(app)
        .get('/viewing-restricted-patients?searchTerm=Smith')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Viewing restricted patients')
          expect(res.text).toContain(
            'There are no results for the name or number you have entered. You can search again.'
          )
        })
    })
  })
})

describe('POST /viewing-restricted-patients', () => {
  it('should redirect to viewing restricted patients page with the correct search text', () => {
    return request(app)
      .post('/viewing-restricted-patients')
      .send({ searchTerm: 'Smith' })
      .expect('Location', '/viewing-restricted-patients?searchTerm=Smith')
  })

  it('should render validation messages', () => {
    return request(app)
      .post('/viewing-restricted-patients')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Error: Viewing restricted patients')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter a restricted patient’s name or prison number')
      })
  })
})
