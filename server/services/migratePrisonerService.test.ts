import { User } from '../data/hmppsAuthClient'
import MigratePrisonerService from './migratePrisonerService'

const migratePatient = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientApiClient', () => jest.fn().mockImplementation(() => ({ migratePatient })))

const user = {
  username: 'user1',
  name: 'User',
  activeCaseLoadId: 'MDI',
  token: 'token-1',
} as User

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

      expect(migratePatient).toBeCalledWith({
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
