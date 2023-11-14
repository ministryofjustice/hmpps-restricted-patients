import HospitalSearchService, { Hospital } from './hospitalSearchService'
import PrisonApiClient from '../data/prisonApiClient'

import { Context } from './context'

const getAgenciesByType = jest.fn()
const getAgencyDetails = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonApiClient', () =>
  jest.fn().mockImplementation(() => ({ getAgenciesByType, getAgencyDetails })),
)

const user = {
  username: 'user1',
  token: 'token-1',
} as Context

describe('movePrisonerService', () => {
  let service: HospitalSearchService

  beforeEach(() => {
    service = new HospitalSearchService()
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
          {
            agencyId: 'BURNLY',
            description: 'Burnley Hospital',
            longDescription: 'Burnley Teaching Hospital',
            agencyType: 'HOSP',
            active: false,
          } as unknown as Hospital,
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

      expect(PrisonApiClient).toBeCalledWith(user.token)
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

  describe('getHospital', () => {
    beforeEach(() => {
      getAgencyDetails.mockResolvedValue({
        agencyId: 'SHEFF',
        description: 'Sheffield Hospital',
        longDescription: 'Sheffield Teaching Hospital',
        agencyType: 'HOSP',
        active: true,
      } as Hospital)
    })

    it('makes the correct calls and returns the hospital details', async () => {
      const results = await service.getHospital('SHEFF', user)

      expect(PrisonApiClient).toBeCalledWith(user.token)
      expect(getAgencyDetails).toBeCalledWith('SHEFF')
      expect(results).toStrictEqual({
        active: true,
        agencyId: 'SHEFF',
        agencyType: 'HOSP',
        description: 'Sheffield Hospital',
        longDescription: 'Sheffield Teaching Hospital',
      })
    })
  })
})
