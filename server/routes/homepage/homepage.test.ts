import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from '../testutils/appSetup'
import UserService from '../../services/userService'

jest.mock('../../services/userService.ts')

const userService = new UserService(null) as jest.Mocked<UserService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false }, { userService })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('', () => {
  it('should get the home page with all tiles if the roles are present', () => {
    userService.getUserRoles.mockResolvedValue([
      'SEARCH_RESTRICTED_PATIENT',
      'TRANSFER_RESTRICTED_PATIENT',
      'REMOVE_RESTRICTED_PATIENT',
    ])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Move someone to a hospital')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).toContain('Remove someone from restricted patients')
      })
  })
  it('should get the home page with appropriate tiles if not all of the roles are present', () => {
    userService.getUserRoles.mockResolvedValue(['SEARCH_RESTRICTED_PATIENT', 'REMOVE_RESTRICTED_PATIENT'])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).toContain('Remove someone from restricted patients')
        expect(res.text).not.toContain('Move someone to a hospital')
      })
  })
  it('should get the home page with appropriate tiles if not all of the roles are present', () => {
    userService.getUserRoles.mockResolvedValue(['SEARCH_RESTRICTED_PATIENT'])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).not.toContain('Remove someone from restricted patients')
        expect(res.text).not.toContain('Move someone to a hospital')
      })
  })
  it('should give a 401 and error page when none of the roles are present', () => {
    userService.getUserRoles.mockResolvedValue([])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(401)
      .expect(res => {
        expect(res.text).toContain('You do not have permission to view this page')
      })
  })
})
