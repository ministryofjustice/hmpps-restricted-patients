import UserService from './userService'
import ManageUsersApiClient, { type User } from '../data/manageUsersApiClient'
import { CaseLoad } from '../data/prisonApiClient'

const getUserCaseLoads = jest.fn()

jest.mock('../data/manageUsersApiClient')
jest.mock('../data/prisonApiClient', () => {
  return jest.fn().mockImplementation(() => {
    return { getUserCaseLoads }
  })
})

const token = 'some token'

describe('User service', () => {
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let userService: UserService

  describe('getUser', () => {
    beforeEach(() => {
      manageUsersApiClient = new ManageUsersApiClient() as jest.Mocked<ManageUsersApiClient>
      userService = new UserService(manageUsersApiClient)
    })

    it('Retrieves and formats relevant user details', async () => {
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)
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
        displayName: 'John Smith',
        name: 'john smith',
      })
    })

    it('Propagates error', async () => {
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
