import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from '../testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /search-for-restricted-patient', () => {
  it('should load the search for a restricted patient page', () => {
    return request(app)
      .get('/search-for-restricted-patient')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a restricted patient')
        expect(res.text).toContain('Enter a restricted patient’s name or prison number')
      })
  })
})

describe('POST /search-for-restricted-patient', () => {
  it('should redirect to select restricted patient page with the correct search text', () => {
    return request(app)
      .post('/search-for-restricted-patient')
      .send({ searchTerm: 'Smith' })
      .expect('Location', '/viewing-restricted-patients?searchTerm=Smith')
  })

  it('should render validation messages', () => {
    return request(app)
      .post('/search-for-restricted-patient')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Error: Search for a restricted patient')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter a restricted patient’s name or prison number')
      })
  })
})
