import RestrictedPatientSearchService, { RestrictedPatientSearchSummary } from './restrictedPatientSearchService'
import RestrictedPatientSearchClient from '../data/restrictedPatientSearchClient'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

const search = jest.fn()
const getPrisonerImage = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientSearchClient', () => {
  return jest.fn().mockImplementation(() => {
    return { search }
  })
})

const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

const user = {
  token: 'token-1',
} as User

describe('restrictedPatientSearchService', () => {
  let service: RestrictedPatientSearchService

  beforeEach(() => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue('some token')

    service = new RestrictedPatientSearchService(hmppsAuthClient)
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
          locationDescription: 'Outside - released from Moorland (HMP & YOI)',
          restrictedPatient: true,
          supportingPrisonId: 'MDI',
          dischargedHospitalId: 'HAZLWD',
          dischargedHospitalDescription: 'Hazelwood House',
          dischargeDate: '2021-06-07',
          dischargeDetails: 'Psychiatric Hospital Discharge to Hazelwood House',
        },
        {
          alerts: [],
          firstName: 'STEVE',
          lastName: 'JONES',
          prisonName: 'HMP Doncaster',
          prisonerNumber: 'A1234AB',
          locationDescription: 'Outside - released from Doncaster',
          restrictedPatient: true,
          supportingPrisonId: 'DNI',
          dischargedHospitalId: 'YEWTHO',
          dischargedHospitalDescription: 'Yew Trees',
          dischargeDate: '2021-06-08',
          dischargeDetails: 'Psychiatric Hospital Discharge to Yew Trees',
        },
      ])
      const results = await service.search({ searchTerm: 'a1234aA' }, user)
      expect(results).toStrictEqual([
        {
          alerts: [],
          displayName: 'Jones, Steve',
          firstName: 'STEVE',
          formattedAlerts: [],
          lastName: 'JONES',
          prisonName: 'HMP Doncaster',
          prisonerNumber: 'A1234AB',
          supportingPrisonId: 'DNI',
          dischargedHospitalId: 'YEWTHO',
          dischargedHospitalDescription: 'Yew Trees',
          dischargeDate: '2021-06-08',
          dischargeDetails: 'Psychiatric Hospital Discharge to Yew Trees',
        },
        {
          alerts: [
            {
              alertCode: 'TCPA',
              alertType: 'T',
            },
            {
              alertCode: 'XCU',
              alertType: 'X',
            },
          ],
          displayName: 'Smith, John',
          formattedAlerts: [
            {
              alertCodes: ['XCU'],
              classes: 'alert-status alert-status--controlled-unlock',
              label: 'Controlled unlock',
            },
          ],
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonerNumber: 'A1234AA',
          prisonName: 'HMP Moorland',
          supportingPrisonId: 'MDI',
          dischargedHospitalId: 'HAZLWD',
          dischargedHospitalDescription: 'Hazelwood House',
          dischargeDate: '2021-06-07',
          dischargeDetails: 'Psychiatric Hospital Discharge to Hazelwood House',
        } as RestrictedPatientSearchSummary,
      ])
      expect(RestrictedPatientSearchClient).toBeCalledWith(user.token)
      expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA' })
    })

    it('search by prisoner name', async () => {
      const searchResult = {
        firstName: 'JOHN',
        lastName: 'SMITH',
        prisonName: 'HMP Moorland',
        prisonerNumber: 'A1234AA',
        supportingPrisonId: 'MDI',
        dischargedHospitalId: 'HAZLWD',
        dischargeDate: '2021-06-07',
      }
      search.mockResolvedValue([searchResult])
      const results = await service.search({ searchTerm: 'Smith, John' }, user)
      expect(results).toStrictEqual([
        {
          displayName: 'Smith, John',
          formattedAlerts: [],
          ...searchResult,
        } as RestrictedPatientSearchSummary,
      ])
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
