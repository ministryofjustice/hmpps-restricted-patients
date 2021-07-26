import 'reflect-metadata'
import nock from 'nock'
import config from '../config'
import logger from '../../logger'
import PrisonApiClient from './prisonApiClient'

jest.mock('../../logger')

describe('prisonApiClient', () => {
  let fakePrisonApi: nock.Scope
  let client: PrisonApiClient

  const token = 'token-1'

  beforeEach(() => {
    fakePrisonApi = nock(config.apis.prison.url)
    client = new PrisonApiClient(token)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getPrisonerImage', () => {
    it('should return image data from api', async () => {
      fakePrisonApi
        .get(`/api/bookings/offenderNo/A1234AA/image/data`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, 'image data', { 'Content-Type': 'image/jpeg' })

      const response = await client.getPrisonerImage('A1234AA')

      expect(response.read()).toEqual(Buffer.from('image data'))
    })

    it('should log at only info level for 404s', async () => {
      fakePrisonApi
        .get(`/api/bookings/offenderNo/A1234AA/image/data`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(404)

      expect.assertions(3)

      await expect(client.getPrisonerImage('A1234AA')).rejects.toEqual(new Error('Not Found'))

      expect(logger.info).toHaveBeenCalled()
      expect(logger.warn).not.toHaveBeenCalled()
    })
  })
})
