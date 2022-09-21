import MovePrisonerService from './movePrisonerService'
import { User } from '../data/hmppsAuthClient'

const dischargePatient = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientApiClient', () => jest.fn().mockImplementation(() => ({ dischargePatient })))

const user = {
  username: 'user1',
  name: 'User',
  activeCaseLoadId: 'MDI',
  token: 'token-1',
} as User

describe('movePrisonerService', () => {
  let service: MovePrisonerService

  beforeEach(() => {
    service = new MovePrisonerService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('dischargePatientToHospital', () => {
    beforeEach(() => {
      dischargePatient.mockResolvedValue({
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      })
    })

    it('makes the correct calls and returns the received data', async () => {
      const results = await service.dischargePatientToHospital('A1234AA', 'MDI', 'SHEFF', user)

      expect(dischargePatient).toBeCalledWith({
        offenderNo: 'A1234AA',
        fromLocationId: 'MDI',
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
