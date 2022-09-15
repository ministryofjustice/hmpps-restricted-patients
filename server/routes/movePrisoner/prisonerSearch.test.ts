import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes, { mockJwtDecode } from '../testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false, roles: ['TRANSFER_RESTRICTED_PATIENT'] })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /search-for-prisoner', () => {
  it('should load the search for a prisoner page', () => {
    return request(app)
      .get('/move-to-hospital/search-for-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a prisoner to move')
      })
  })

  it('should render not found page if user missing privileges', () => {
    mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
    return request(app)
      .get('/move-to-hospital/search-for-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})

describe('POST /search-for-prisoner', () => {
  it('should redirect to select prisoner page with the correct search text', () => {
    return request(app)
      .post('/move-to-hospital/search-for-prisoner')
      .send({ searchTerm: 'Smith' })
      .expect('Location', '/move-to-hospital/select-prisoner?searchTerm=Smith')
  })

  it('should render validation messages', () => {
    return request(app)
      .post('/move-to-hospital/search-for-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Error: Search for a prisoner to move')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter a prisoner’s name or number')
      })
  })

  it('should render not found page if user missing privileges', () => {
    mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
    return request(app)
      .post('/move-to-hospital/search-for-prisoner')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})
