import nock from 'nock'
import config from '../config'
import FrontendComponentsClient from './frontendComponentsClient'

describe('FrontendComponentsClient', () => {
  const client = new FrontendComponentsClient('notused')

  config.apis.frontendComponents.url = 'http://localhost:8200'
  let fakeFrontendComponents: nock.Scope

  beforeEach(() => {
    fakeFrontendComponents = nock(config.apis.frontendComponents.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should get frontend component', async () => {
      const userToken = 'a-user-token'
      const expectedResponse = { some: 'response' }

      fakeFrontendComponents
        .get('/components?component=header&component=footer')
        .matchHeader('x-user-token', userToken)
        .reply(200, expectedResponse)

      const actual = await client.getComponents(userToken)
      expect(actual).toEqual(expectedResponse)
      expect(nock.isDone()).toBe(true)
    })
  })
})
