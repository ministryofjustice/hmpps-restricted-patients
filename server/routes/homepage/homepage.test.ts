import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../testutils/appSetup'
import UserService from '../../services/userService'

jest.mock('../../services/userService.ts')

const userService = new UserService(null) as jest.Mocked<UserService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false, services: { userService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('view tiles', () => {
  it('should get the home page with all tiles if the roles are present', () => {
    userService.getUserRoles.mockReturnValue([
      'SEARCH_RESTRICTED_PATIENT',
      'TRANSFER_RESTRICTED_PATIENT',
      'REMOVE_RESTRICTED_PATIENT',
      'RESTRICTED_PATIENT_MIGRATION',
    ])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Move someone to a hospital')
        expect(res.text).toContain('Add a released prisoner into restricted patients')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).toContain('Remove someone from restricted patients')
        expect(res.text).toContain('Help and support')
      })
  })
  it('should get the home page with appropriate tiles if not all of the roles are present', () => {
    userService.getUserRoles.mockReturnValue(['SEARCH_RESTRICTED_PATIENT', 'REMOVE_RESTRICTED_PATIENT'])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).toContain('Remove someone from restricted patients')
        expect(res.text).not.toContain('Move someone to a hospital')
        expect(res.text).not.toContain('Add a released prisoner into restricted patients')
        expect(res.text).toContain('Help and support')
      })
  })
  it('should get the home page with appropriate tiles if a single role is present', () => {
    userService.getUserRoles.mockReturnValue(['SEARCH_RESTRICTED_PATIENT'])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Manage restricted patients')
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).not.toContain('Remove someone from restricted patients')
        expect(res.text).not.toContain('Move someone to a hospital')
        expect(res.text).not.toContain('Add a released prisoner into restricted patients')
        expect(res.text).toContain('Help and support')
      })
  })
  it('should show help page regardless of role', () => {
    userService.getUserRoles.mockReturnValue([])
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Help and support')
      })
  })
})
