import PrisonerSearchService, { PrisonerSearchSummary } from './prisonerSearchService'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import PrisonApiClient from '../data/prisonApiClient'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

const search = jest.fn()
const getPrisonerImage = jest.fn()
const getPrisonerDetails = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerSearchClient', () => {
  return jest.fn().mockImplementation(() => {
    return { search }
  })
})

jest.mock('../data/prisonApiClient', () => {
  return jest.fn().mockImplementation(() => {
    return { getPrisonerImage, getPrisonerDetails }
  })
})

const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

const token = 'some token'
const prisonIds = ['PR1', 'PR2']
const user = {
  username: 'user1',
  name: 'User',
  activeCaseLoadId: 'MDI',
  token: 'token-1',
} as User

describe('prisonerSearchService', () => {
  let service: PrisonerSearchService

  beforeEach(() => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)

    service = new PrisonerSearchService(hmppsAuthClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('search', () => {
    it('search by prisoner identifier', async () => {
      search.mockResolvedValue([
        {
          alerts: [
            { expired: false, alertType: 'T', alertCode: 'TCPA' },
            { expired: false, alertType: 'X', alertCode: 'XCU' },
          ],
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AA',
          cellLocation: '1-2-015',
        },
        {
          alerts: [],
          firstName: 'STEVE',
          lastName: 'JONES',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AB',
          cellLocation: '1-2-016',
        },
      ])
      const results = await service.search({ searchTerm: 'a1234aA', prisonIds }, user)
      expect(results).toStrictEqual([
        {
          alerts: [],
          cellLocation: '1-2-016',
          displayName: 'Jones, Steve',
          firstName: 'STEVE',
          formattedAlerts: [],
          lastName: 'JONES',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AB',
        },
        {
          alerts: [
            {
              alertCode: 'TCPA',
              alertType: 'T',
              expired: false,
            },
            {
              alertCode: 'XCU',
              alertType: 'X',
              expired: false,
            },
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
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonerNumber: 'A1234AA',
          prisonName: 'HMP Moorland',
        } as PrisonerSearchSummary,
      ])
      expect(PrisonerSearchClient).toBeCalledWith(user.token)
      expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA', prisonIds })
    })

    it('search by prisoner name', async () => {
      search.mockResolvedValue([
        {
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonName: 'HMP Moorland',
          prisonerNumber: 'A1234AA',
        },
      ])
      const results = await service.search({ searchTerm: 'Smith, John', prisonIds }, user)
      expect(results).toStrictEqual([
        {
          displayName: 'Smith, John',
          formattedAlerts: [],
          firstName: 'JOHN',
          lastName: 'SMITH',
          prisonerNumber: 'A1234AA',
          prisonName: 'HMP Moorland',
        } as PrisonerSearchSummary,
      ])
      expect(PrisonerSearchClient).toBeCalledWith(user.token)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
    })

    it('search by prisoner surname only', async () => {
      await service.search({ searchTerm: 'Smith', prisonIds }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith', prisonIds })
    })

    it('search by prisoner name separated by a space', async () => {
      await service.search({ searchTerm: 'Smith John', prisonIds }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
    })

    it('search by prisoner name separated by many spaces', async () => {
      await service.search({ searchTerm: '    Smith   John ', prisonIds }, user)
      expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
    })

    it('search by prisoner identifier with extra spaces', async () => {
      await service.search({ searchTerm: '    A1234AA ', prisonIds }, user)
      expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA', prisonIds })
    })
  })

  describe('getPrisonerImage', () => {
    it('uses prison api to request image data', async () => {
      getPrisonerImage.mockResolvedValue('image data')

      const result = await service.getPrisonerImage('A1234AA', {
        activeCaseLoadId: 'MDI',
        name: 'User',
        username: 'user1',
        token: 'token-1',
        authSource: 'auth',
      })

      expect(result).toEqual('image data')
      expect(PrisonApiClient).toBeCalledWith(token)
      expect(getPrisonerImage).toBeCalledWith('A1234AA')
    })
  })

  describe('getPrisonerDetails', () => {
    it('returns correctly formatted prisoner details', async () => {
      getPrisonerDetails.mockResolvedValue({
        offenderNo: 'A1234AA',
        firstName: 'JOHN',
        lastName: 'SMITH',
        assignedLivingUnit: { description: '1-2-015' },
        categoryCode: 'C',
        alerts: [
          { expired: false, alertType: 'T', alertCode: 'TCPA' },
          { expired: false, alertType: 'X', alertCode: 'XCU' },
          { expired: true, alertType: 'X', alertCode: 'XGANG' },
        ],
      })

      const result = await service.getPrisonerDetails('A1234AA', {
        activeCaseLoadId: 'MDI',
        name: 'User',
        username: 'user1',
        token: 'token-1',
        authSource: 'auth',
      })

      expect(result).toEqual({
        alerts: [
          { expired: false, alertCode: 'TCPA', alertType: 'T' },
          { expired: false, alertCode: 'XCU', alertType: 'X' },
          { expired: true, alertCode: 'XGANG', alertType: 'X' },
        ],
        assignedLivingUnit: { description: '1-2-015' },
        categoryCode: 'C',
        displayName: 'Smith, John',
        firstName: 'JOHN',
        formattedAlerts: [
          {
            alertCodes: ['XCU'],
            classes: 'alert-status alert-status--controlled-unlock',
            label: 'Controlled unlock',
          },
        ],
        friendlyName: 'John Smith',
        lastName: 'SMITH',
        offenderNo: 'A1234AA',
        prisonerNumber: 'A1234AA',
      })
      expect(PrisonApiClient).toBeCalledWith(token)
      expect(getPrisonerDetails).toBeCalledWith('A1234AA')
    })
  })
})
