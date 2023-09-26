import FrontendComponentsService from './frontendComponentsService'
import FrontendComponentsClient, { Component } from '../data/frontendComponentsClient'

const getComponents = jest.fn()

jest.mock('../data/frontendComponentsClient', () => jest.fn().mockImplementation(() => ({ getComponents })))

describe('frontendComponentsService', () => {
  let service: FrontendComponentsService

  beforeEach(() => {
    service = new FrontendComponentsService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getComponents', () => {
    beforeEach(() => {
      getComponents.mockResolvedValue({
        header: {
          html: '<div>Header</div>',
          css: ['header.css'],
          javascript: [],
        } as Component,
        footer: {
          html: '<div>Footer</div>',
          css: ['footer.css'],
          javascript: ['footer.js'],
        } as Component,
      })
    })

    it('calls the frontend components and returns the data', async () => {
      const results = await service.getComponents('user-token')

      expect(FrontendComponentsClient).toBeCalledWith('user-token')
      expect(getComponents).toBeCalledWith('user-token')
      expect(results).toStrictEqual({
        headerHtml: '<div>Header</div>',
        footerHtml: '<div>Footer</div>',
        cssIncludes: ['header.css', 'footer.css'],
        jsIncludes: ['footer.js'],
      })
    })
  })
})
