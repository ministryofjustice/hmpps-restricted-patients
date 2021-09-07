import UserService from './userService'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'
import { CaseLoad } from '../data/prisonApiClient'

const getUserCaseLoads = jest.fn()

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonApiClient', () => {
  return jest.fn().mockImplementation(() => {
    return { getUserCaseLoads }
  })
})

const token = 'some token'

describe('User service', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>
      userService = new UserService(hmppsAuthClient)
    })

    it('Retrieves and formats relevant user details', async () => {
      hmppsAuthClient.getUser.mockResolvedValue({ name: 'john smith' } as User)
      getUserCaseLoads.mockResolvedValue([
        {
          caseLoadId: 'MDI',
          description: 'Moorland',
          type: 'INST',
          caseloadFunction: 'TEST',
          currentlyActive: true,
        },
        {
          caseLoadId: 'LEI',
          description: 'Leeds',
          type: 'INST',
          caseloadFunction: 'TEST',
          currentlyActive: false,
        },
      ] as CaseLoad[])

      const result = await userService.getUser(token)

      expect(result).toEqual({
        activeCaseLoad: {
          caseLoadId: 'MDI',
          caseloadFunction: 'TEST',
          currentlyActive: true,
          description: 'Moorland',
          type: 'INST',
        },
        allCaseLoads: [
          {
            caseLoadId: 'MDI',
            caseloadFunction: 'TEST',
            currentlyActive: true,
            description: 'Moorland',
            type: 'INST',
          },
          {
            caseLoadId: 'LEI',
            description: 'Leeds',
            type: 'INST',
            caseloadFunction: 'TEST',
            currentlyActive: false,
          },
        ],
        displayName: 'John Smith',
        name: 'john smith',
      })
    })

    it('Propagates error', async () => {
      hmppsAuthClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
