import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, mockJwtDecode } from '../testutils/appSetup'

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('/search-for-patient', () => {
  beforeEach(() => {
    app = appWithAllRoutes({ production: false, roles: ['RESTRICTED_PATIENT_MIGRATION'] })
  })

  describe('GET /search-for-patient', () => {
    it('should load the search for a restricted patient page', () => {
      return request(app)
        .get('/change-supporting-prison/search-for-patient')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Search for a restricted patient')
          expect(res.text).toContain('Enter a restricted patient’s name or prison number')
        })
    })

    it('should render not found page if user missing privileges', () => {
      mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
      return request(app)
        .get('/change-supporting-prison/search-for-patient')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })
  })

  describe('POST /search-for-patient', () => {
    it('should redirect to select restricted patient page with the correct search text', () => {
      return request(app)
        .post('/change-supporting-prison/search-for-patient')
        .send({ searchTerm: 'Smith' })
        .expect('Location', '/change-supporting-prison/select-patient?searchTerm=Smith')
    })

    it('should render validation messages', () => {
      return request(app)
        .post('/change-supporting-prison/search-for-patient')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Error: Search for a restricted patient')
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Enter a restricted patient’s name or prison number')
        })
    })

    it('should render not found page if user missing privileges', () => {
      mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
      return request(app)
        .post('/change-supporting-prison/search-for-patient')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Page not found')
        })
    })
  })
})
