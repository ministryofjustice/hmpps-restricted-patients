import 'reflect-metadata'
import { Request, Response } from 'express'
import RemoveRestrictedPatientRoutes from './RemoveRestrictedPatientRoutes'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'
import HmppsAuthClient from '../../data/hmppsAuthClient'
import { RemoveRestrictedPatientPath } from './constants'

jest.mock('../../services/restrictedPatientSearchService')

describe('RemoveRestrictedPatientRoutes', () => {
  let res: Response
  let req: Request
  let restrictedPatientSearchService: RestrictedPatientSearchService
  let routes: RemoveRestrictedPatientRoutes
  beforeEach(() => {
    res = {
      render: jest.fn(),
      internalRedirect: jest.fn(),
    } as unknown as Response
    req = {} as Request
    restrictedPatientSearchService = new RestrictedPatientSearchService(jest.fn() as unknown as HmppsAuthClient)
    routes = new RemoveRestrictedPatientRoutes(restrictedPatientSearchService)
  })

  describe('displaySearch', () => {
    it('should render the expected template with the correct for action', () => {
      routes.displaySearch(req, res)
      expect(res.render).toHaveBeenCalledWith('pages/patientSearch', {
        action: RemoveRestrictedPatientPath.SearchResults,
      })
    })
  })

  describe('searchFormRedirect', () => {
    it('should redirect with the search term from the body as a query', () => {
      req.body = {
        searchTerm: 'abc',
      }
      routes.searchFormRedirect(req, res)
      expect(res.internalRedirect).toHaveBeenCalledWith('?searchTerm=abc')
    })
  })

  describe('displaySearchResults', () => {
    it('should redirect to search page if there is no search term query', async () => {
      req.query = {
        searchTerm: '',
      }
      await routes.displaySearchResults(req, res)
      expect(res.internalRedirect).toHaveBeenCalledWith(RemoveRestrictedPatientPath.DisplaySearch)
    })

    it('should search for patients if there is a search term query', async () => {
      req.query = {
        searchTerm: 'abc',
      }
      res.locals = {
        user: 'user-1',
      }
      await routes.displaySearchResults(req, res)
      expect(restrictedPatientSearchService.search).toHaveBeenCalledWith({ searchTerm: 'abc' }, 'user-1')
    })

    it('should render the expected template with data', async () => {
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
      req.query = {
        searchTerm: 'abc',
      }
      res.locals = {
        user: 'user-1',
      }
      const heading = 'Select a restricted patient'
      await routes.displaySearchResults(req, res)
      expect(res.render).toHaveBeenCalledWith('pages/viewPatients', {
        tableData: {
          attributes: {
            'data-test': 'patient-search-results-table',
            'data-module': 'moj-sortable-table',
          },
          head: [
            {
              html: '<span class="govuk-visually-hidden">Picture</span>',
            },
            {
              text: 'Name',
              attributes: {
                'aria-sort': 'ascending',
              },
            },
            {
              text: 'Prison number',
            },
            {
              text: 'Hospital',
              attributes: {
                'aria-sort': 'none',
              },
            },
            {
              text: '',
            },
          ],
          rows: [
            [
              {
                html: '<img src="/prisoner/A1234AA/image" alt="Photograph of Smith, John" class="results-table__image" />',
              },
              {
                html: '<a href="http://localhost:3002/prisoner/A1234AA" class="govuk-link">Smith, John</a>',
              },
              {
                text: 'A1234AA',
              },
              {
                text: 'Yew Trees',
              },
              {
                html: `<a href="/person-removed/A1234AA" class="govuk-link" data-test="remove-restricted-patient-link">
                <span class="govuk-visually-hidden">Smith, John - </span>Remove as a restricted patient
              </a>`,
              },
            ],
          ],
        },
        heading,
        pageTitle: heading,
        searchTerm: 'abc',
      })
    })
  })
})
