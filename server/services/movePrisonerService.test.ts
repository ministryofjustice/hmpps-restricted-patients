import MovePrisonerService from './movePrisonerService'

import { Context } from './context'

const dischargePatient = jest.fn()
const changeSupportingPrison = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientApiClient', () =>
  jest.fn().mockImplementation(() => ({ dischargePatient, changeSupportingPrison })),
)

const user = {
  username: 'user1',
  token: 'token-1',
} as Context

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
        restrictedPatient: {
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
        restrictedPatient: {
          supportingPrison: 'MDI',
        },
      })
    })
  })

  describe('changeSupportingPrison', () => {
    beforeEach(() => {
      changeSupportingPrison.mockResolvedValue({
        restrictedPatient: {
          supportingPrison: 'MDI',
        },
      })
    })

    it('makes the correct calls and returns the received data', async () => {
      const results = await service.changeSupportingPrison('A1234AA', 'MDI', user)

      expect(changeSupportingPrison).toBeCalledWith({
        offenderNo: 'A1234AA',
        supportingPrisonId: 'MDI',
      })
      expect(results).toStrictEqual({
        restrictedPatient: {
          supportingPrison: 'MDI',
        },
      })
    })
  })
})
