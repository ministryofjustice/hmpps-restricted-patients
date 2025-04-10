import MigratePrisonerService from './migratePrisonerService'

import { Context } from './context'

const migratePatient = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientApiClient', () => jest.fn().mockImplementation(() => ({ migratePatient })))

const user = {
  username: 'user1',
  token: 'token-1',
} as Context

describe('migratePrisonerService', () => {
  let service: MigratePrisonerService

  beforeEach(() => {
    service = new MigratePrisonerService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('dischargePatientToHospital', () => {
    beforeEach(() => {
      migratePatient.mockResolvedValue({
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      })
    })

    it('makes the correct calls and returns the received data', async () => {
      const results = await service.migrateToHospital('A1234AA', 'SHEFF', user)

      expect(migratePatient).toHaveBeenCalledWith({
        offenderNo: 'A1234AA',
        hospitalLocationCode: 'SHEFF',
      })
      expect(results).toStrictEqual({
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      })
    })
  })
})
