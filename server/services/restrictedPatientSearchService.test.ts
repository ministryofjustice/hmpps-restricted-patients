import RestrictedPatientSearchService from './restrictedPatientSearchService'
import RestrictedPatientSearchClient from '../data/restrictedPatientSearchClient'
import RestrictedPatientSearchResult from '../data/restrictedPatientSearchResult'
import { User } from '../data/hmppsAuthClient'

const search = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientSearchClient', () => {
  return jest.fn().mockImplementation(() => {
    return { search }
  })
})

const user = {
  token: 'token-1',
} as User

describe('restrictedPatientSearchService', () => {
  let service: RestrictedPatientSearchService

  beforeEach(() => {
    service = new RestrictedPatientSearchService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('search', () => {
    it('search by prisoner identifier', async () => {
      search.mockResolvedValue([
        {
          alerts: [
            { alertType: 'T', alertCode: 'TCPA' },
            { alertType: 'X', alertCode: 'XCU' },
          ],
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AA',
          supportingPrisonId: 'MDI',
          dischargedHospitalId: 'HAZLWD',
          dischargedHospitalDescription: 'Hazelwood House',
          dischargeDate: '2021-06-07',
          dischargeDetails: 'Psychiatric Hospital Discharge to Hazelwood House',
        } as RestrictedPatientSearchResult,
        {
          alerts: [],
          firstName: 'STEVE',
          lastName: 'JONES',
          prisonName: 'HMP Doncaster',
          prisonerNumber: 'A1234AB',
          supportingPrisonId: 'DNI',
          dischargedHospitalId: 'YEWTHO',
          dischargedHospitalDescription: 'Yew Trees',
          dischargeDate: '2021-06-08',
          dischargeDetails: 'Psychiatric Hospital Discharge to Yew Trees',
        } as RestrictedPatientSearchResult,
      ])

      const results = await service.search({ searchTerm: 'a1234aA' }, user)
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ displayName: 'Jones, Steve' }),
          expect.objectContaining({ displayName: 'Smith, John' }),
        ])
      )

      expect(RestrictedPatientSearchClient).toBeCalledWith(user.token)
      expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA' })
    })

    it('search by prisoner name', async () => {
      search.mockResolvedValue([
        {
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AA',
          supportingPrisonId: 'MDI',
          dischargedHospitalId: 'HAZLWD',
          dischargeDate: '2021-06-07',
        } as RestrictedPatientSearchResult,
      ])

      const results = await service.search({ searchTerm: 'Smith, John' }, user)
      expect(results).toEqual(expect.arrayContaining([expect.objectContaining({ displayName: 'Smith, John' })]))
      expect(RestrictedPatientSearchClient).toBeCalledWith(user.token)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John' })
    })

    it('search by prisoner surname only', async () => {
      await service.search({ searchTerm: 'Smith' }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith' })
    })

    it('search by prisoner name separated by a space', async () => {
      await service.search({ searchTerm: 'Smith John' }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John' })
    })

    it('search by prisoner name separated by many spaces', async () => {
      await service.search({ searchTerm: '    Smith   John ' }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John' })
    })

    it('search by prisoner identifier with extra spaces', async () => {
      await service.search({ searchTerm: '    A1234AA ' }, user)
      expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA' })
    })
  })
})
