import MovePrisonerService, { Hospital } from './movePrisonerService'
import PrisonApiClient from '../data/prisonApiClient'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

const getAgenciesByType = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonApiClient', () => {
  return jest.fn().mockImplementation(() => {
    return { getAgenciesByType }
  })
})

const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

const token = 'some token'
const user = {
  username: 'user1',
  name: 'User',
  activeCaseLoadId: 'MDI',
  token: 'token-1',
} as User

describe('movePrisonerService', () => {
  let service: MovePrisonerService

  beforeEach(() => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)

    service = new MovePrisonerService(hmppsAuthClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getHospitals', () => {
    beforeEach(() => {
      getAgenciesByType
        .mockResolvedValue([
          {
            agencyId: 'SHEFF',
            description: 'Sheffield Hospital',
            longDescription: 'Sheffield Teaching Hospital',
            agencyType: 'HOSP',
            active: true,
          } as Hospital,
        ])
        .mockResolvedValueOnce([
          {
            agencyId: 'ROTH',
            description: 'Rotherham Hospital',
            longDescription: 'Rotherham General Hospital',
            agencyType: 'HSHOSP',
            active: true,
          } as Hospital,
        ])
    })

    it('makes the correct calls and returns the hospitals', async () => {
      const results = await service.getHospitals(user)

      expect(PrisonApiClient).toBeCalledWith(token)
      expect(getAgenciesByType).toBeCalledWith('HOSPITAL')
      expect(getAgenciesByType).toBeCalledWith('HSHOSP')
      expect(results).toStrictEqual([
        {
          active: true,
          agencyId: 'ROTH',
          agencyType: 'HSHOSP',
          description: 'Rotherham Hospital',
          longDescription: 'Rotherham General Hospital',
        },
        {
          active: true,
          agencyId: 'SHEFF',
          agencyType: 'HOSP',
          description: 'Sheffield Hospital',
          longDescription: 'Sheffield Teaching Hospital',
        },
      ])
    })
  })
})
