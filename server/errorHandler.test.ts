import type { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from './routes/testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  describe('In dev mode', () => {
    it('should render content with stack and status', async () => {
      return request(app)
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('NotFoundError: Not found')
          expect(res.text).toContain('404')
          expect(res.text).not.toContain('Sorry, there is a problem with the service')
        })
    })
  })

  describe('In production mode', () => {
    it('should render content without stack', () => {
      return request(appWithAllRoutes({ production: true }))
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Sorry, there is a problem with the service')
          expect(res.text).not.toContain('404')
          expect(res.text).not.toContain('NotFoundError: Not found')
        })
    })

    it('should include link to request url if no redirect url', async () => {
      return request(app)
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('/unknown')
        })
    })
  })
})
