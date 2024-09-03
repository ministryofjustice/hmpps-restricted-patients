import AgencySearchService from './agencySearchService'
import PrisonApiClient, { Prison } from '../data/prisonApiClient'

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

describe('agencySearchService', () => {
  let service: AgencySearchService

  beforeEach(() => {
    service = new AgencySearchService()
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
          } as Prison,
          {
            agencyId: 'BURNLY',
            description: 'Burnley Hospital',
            longDescription: 'Burnley Teaching Hospital',
            agencyType: 'HOSP',
            active: false,
          } as Prison,
        ])
        .mockResolvedValueOnce([
          {
            agencyId: 'ROTH',
            description: 'Rotherham Hospital',
            longDescription: 'Rotherham General Hospital',
            agencyType: 'HSHOSP',
            active: true,
          } as Prison,
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

  describe('getPrisons', () => {
    beforeEach(() => {
      getAgenciesByType.mockResolvedValue([
        {
          agencyId: 'MDI',
          description: 'Moorland',
          longDescription: 'HMP Moorland',
          agencyType: 'INST',
          active: true,
        } as Prison,
        {
          agencyId: 'DNI',
          description: 'Doncaster',
          longDescription: 'HMP Doncaster',
          agencyType: 'INST',
          active: false,
        } as unknown as Prison,
      ])
    })

    it('makes the correct calls and returns the prisons', async () => {
      const results = await service.getPrisons(user)

      expect(PrisonApiClient).toBeCalledWith(user.token)
      expect(getAgenciesByType).toBeCalledWith('INST')
      expect(results).toStrictEqual([
        {
          active: true,
          agencyId: 'MDI',
          agencyType: 'INST',
          description: 'Moorland',
          longDescription: 'HMP Moorland',
        },
      ])
    })
  })

  describe('getAgency', () => {
    beforeEach(() => {
      getAgencyDetails.mockResolvedValue({
        agencyId: 'SHEFF',
        description: 'Sheffield Hospital',
        longDescription: 'Sheffield Teaching Hospital',
        agencyType: 'HOSP',
        active: true,
      } as Prison)
    })

    it('makes the correct calls and returns the hospital details', async () => {
      const results = await service.getAgency('SHEFF', user)

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
