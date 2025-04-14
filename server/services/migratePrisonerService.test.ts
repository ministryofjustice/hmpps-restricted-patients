import MigratePrisonerService from './migratePrisonerService'

import { Context } from './context'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'

jest.mock('../data/restrictedPatientApiClient')

const user = {
  username: 'user1',
  token: 'token-1',
} as Context

describe('migratePrisonerService', () => {
  let service: MigratePrisonerService
  const restrictedPatientApiClient = new RestrictedPatientApiClient(null) as jest.Mocked<RestrictedPatientApiClient>

  beforeEach(() => {
    service = new MigratePrisonerService(restrictedPatientApiClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('dischargePatientToHospital', () => {
    beforeEach(() => {
      restrictedPatientApiClient.migratePatient.mockResolvedValue({
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      })
    })

    it('makes the correct calls and returns the received data', async () => {
      const results = await service.migrateToHospital('A1234AA', 'SHEFF', user)

      expect(restrictedPatientApiClient.migratePatient).toHaveBeenCalledWith(
        {
          offenderNo: 'A1234AA',
          hospitalLocationCode: 'SHEFF',
        },
        'token-1',
      )
      expect(results).toStrictEqual({
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      })
    })
  })
})
