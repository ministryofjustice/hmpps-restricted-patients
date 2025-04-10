import RemoveRestrictedPatientService, { RestrictedPatientDetails } from './removeRestrictedPatientService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import PrisonApiClient from '../data/prisonApiClient'
import PrisonerResult from '../data/prisonerResult'
import RestrictedPatientResult from '../data/restrictedPatientResult'

import { Context } from './context'

const removePatient = jest.fn()
const getPatient = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/restrictedPatientApiClient', () => {
  return jest.fn().mockImplementation(() => {
    return { getPatient, removePatient }
  })
})
jest.mock('../data/prisonApiClient')

const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
const prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>

const token = 'some token'
const user = {
  username: 'user1',
  token: 'token-1',
} as Context

describe('removeRestrictedPatientService', () => {
  let service: RemoveRestrictedPatientService

  beforeEach(() => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)

    service = new RemoveRestrictedPatientService(hmppsAuthClient, prisonApiClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('removeRestrictedPatient', () => {
    it('calls the correct api with the correct token and returns the correct response', async () => {
      removePatient.mockResolvedValue({})

      const response = await service.removeRestrictedPatient('A1234AA', user)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(user.username)
      expect(RestrictedPatientApiClient).toBeCalledWith(token)
      expect(response).toStrictEqual({})
    })
  })

  describe('getRestrictedPatient', () => {
    it('makes the correct calls and returns the correctly formatted data', async () => {
      prisonApiClient.getPrisonerDetails.mockResolvedValue({
        lastName: 'SMITH',
        firstName: 'JOHN',
      } as PrisonerResult)

      getPatient.mockResolvedValue({
        hospitalLocation: { description: 'Sheffield Hospital' },
      } as RestrictedPatientResult)

      const response = await service.getRestrictedPatient('A1234AA', user)

      expect(RestrictedPatientApiClient).toHaveBeenCalledWith(user.token)
      expect(prisonApiClient.getPrisonerDetails).toHaveBeenCalledWith('A1234AA', {
        tokenType: 'USER_TOKEN',
        user: { token: 'token-1' },
      })
      expect(response).toStrictEqual({
        displayName: 'Smith, John',
        friendlyName: 'John Smith',
        hospital: 'Sheffield Hospital',
        prisonerNumber: 'A1234AA',
      } as RestrictedPatientDetails)
    })
  })
})
