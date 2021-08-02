import { Express } from 'express'
import request from 'supertest'
import { RemoveRestrictedPatientPath } from './constants'
import appWithAllRoutes from '../testutils/appSetup'
import HmppsAuthClient from '../../data/hmppsAuthClient'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'

jest.mock('../../services/restrictedPatientSearchService')

let app: Express
let restrictedPatientSearchService: RestrictedPatientSearchService

beforeEach(() => {
  restrictedPatientSearchService = new RestrictedPatientSearchService(jest.fn() as unknown as HmppsAuthClient)
  app = appWithAllRoutes({ production: false }, { restrictedPatientSearchService })
  jest.spyOn(restrictedPatientSearchService, 'search').mockResolvedValue([
    {
      alerts: [
        { alertType: 'T', alertCode: 'TCPA' },
        { alertType: 'X', alertCode: 'XCU' },
      ],
      cellLocation: '1-2-015',
      displayName: 'Smith, John',
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

afterEach(() => {
  jest.resetAllMocks()
})

describe('removeRestrictedPatient', () => {
  describe(`GET ${RemoveRestrictedPatientPath.DisplaySearch}`, () => {
    it('should render a search form template', () => {
      return request(app)
        .get(RemoveRestrictedPatientPath.DisplaySearch)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Search for a restricted patient')
          expect(res.text).toContain('data-test="patient-search-term-input">')
          expect(res.text).toContain('data-test="patient-search-submit">')
        })
    })
  })

  describe(`POST ${RemoveRestrictedPatientPath.SearchResults}`, () => {
    it(`should redirect to ${RemoveRestrictedPatientPath.DisplaySearch} if there is no searchTerm`, () => {
      return request(app)
        .post(RemoveRestrictedPatientPath.SearchResults)
        .redirects(1)
        .expect(res => {
          expect(res.redirects.length).toBe(1)
          expect(res.redirects[0]).toMatch(RemoveRestrictedPatientPath.DisplaySearch)
        })
    })

    it(`should redirect to GET ${RemoveRestrictedPatientPath.SearchResults} if there is a searchTerm`, () => {
      return request(app)
        .post(RemoveRestrictedPatientPath.SearchResults)
        .send({ searchTerm: 'abc' })
        .redirects(1)
        .expect(res => {
          expect(res.redirects.length).toBe(1)
          expect(res.redirects[0]).toMatch(RemoveRestrictedPatientPath.SearchResults)
        })
    })
  })

  describe(`GET ${RemoveRestrictedPatientPath.SearchResults}`, () => {
    it(`should display search results is a search term is present`, () => {
      return request(app)
        .get(RemoveRestrictedPatientPath.SearchResults)
        .query({ searchTerm: 'abc' })
        .expect(res => {
          expect(res.text).toContain('Select a restricted patient')
          expect(res.text).toContain('<p class="align-right"><strong>People listed:</strong> 1</p>')
          expect(res.text).toContain(
            '<img src="/prisoner/A1234AA/image" alt="Photograph of Smith, John" class="results-table__image" />'
          )
          expect(res.text).toContain('Smith, John')
          expect(res.text).toContain('Yew Trees')
          expect(res.text).toContain(
            `<a href="/person-removed/A1234AA" class="govuk-link" data-test="remove-restricted-patient-link">
                <span class="govuk-visually-hidden">Smith, John - </span>Remove as a restricted patient
              </a>`
          )
        })
    })
    it(`should display a fallback message for no results found`, () => {
      jest.spyOn(restrictedPatientSearchService, 'search').mockResolvedValue([])
      return request(app)
        .get(RemoveRestrictedPatientPath.SearchResults)
        .send({ searchTerm: 'abc' })
        .query({ searchTerm: 'abc' })
        .expect(res => {
          expect(res.text).toContain('There are no results for the details you have entered.')
        })
    })
  })
})
