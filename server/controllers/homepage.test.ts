import type { Express, Request, Response } from 'express'
import request from 'supertest'
import appWithAllRoutes from '../routes/testutils/appSetup'
import homepageController from './homepage'

let app: Express
let req: any
let res: any
let controller: any

beforeEach(() => {
  req = { session: { userDetails: { activeCaseLoadId: 'MDI' } } }
  res = { locals: {}, render: jest.fn(), redirect: jest.fn() }
  app = appWithAllRoutes({ production: false })
  controller = homepageController()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Tasks', () => {
  it('should show three tabs', async () => {
    await controller(req, res)

    expect(res.render).toHaveBeenCalledWith(
      'pages/homepage',
      expect.objectContaining({
        tasks: [
          {
            id: 'search-restricted-patient',
            heading: 'Search for a restricted patient',
            description: 'Search for a restricted patient to view their details and to add a case note.',
            href: '/manage-restricted-patients/search-for-a-restricted-patient',
            roles: null,
            enabled: true,
          },
          {
            id: 'move-to-hospital',
            heading: 'Move someone to a hospital',
            description:
              'Move someone from either a prison or court to a hospital when detained under the Mental Health Act. This also changes them to a restricted patient.',
            href: '/manage-restricted-patients/search-for-prisoner',
            roles: null,
            enabled: true,
          },
          {
            id: 'remove-from-restricted-patients',
            heading: 'Remove someone from restricted patients',
            description:
              'Remove someone from restricted patients if they have been released from a hospital to the community.',
            href: '/manage-restricted-patients/search-for-a-restricted-patient',
            roles: null,
            enabled: true,
          },
        ],
      })
    )
  })
})
