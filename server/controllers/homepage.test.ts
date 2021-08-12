import type { Request, Response } from 'express'
import homepageController from './homepage'

let req: Request
let res: Response

beforeEach(() => {
  req = { session: { userDetails: { activeCaseLoadId: 'MDI' } } } as Request
  res = { locals: {}, render: jest.fn(), redirect: jest.fn() } as unknown as Response
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Tasks', () => {
  it('should show the available tasks', async () => {
    await homepageController(req, res)

    expect(res.render).toHaveBeenCalledWith(
      'pages/homepage',
      expect.objectContaining({
        tasks: [
          {
            id: 'search-restricted-patient',
            heading: 'Search for a restricted patient',
            description: 'Search for a restricted patient to view their details or add a case note.',
            href: '/search-for-restricted-patient',
            roles: null,
            enabled: true,
          },
          {
            id: 'move-to-hospital',
            heading: 'Move someone to a hospital',
            description:
              'Move someone from either a prison or court to a hospital when detained under the Mental Health Act. This also changes them to a restricted patient.',
            href: '/search-for-prisoner',
            roles: null,
            enabled: true,
          },
          {
            id: 'remove-from-restricted-patients',
            heading: 'Remove someone from restricted patients',
            description:
              'Remove someone from restricted patients if they have been released from a hospital to the community.',
            href: '/search-for-a-restricted-patient',
            roles: null,
            enabled: true,
          },
        ],
      })
    )
  })
})
