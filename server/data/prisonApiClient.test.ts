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
    fakePrisonApi = nock(config.apis.prisonApi.url)
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

  describe('getPrisonerDetails', () => {
    it('should return only the neccessary prisoner details', async () => {
      const result = {
        offenderNo: 'A1234AA',
        firstName: 'JOHN',
        lastName: 'SMITH',
        assignedLivingUnit: { description: '1-2-015' },
        categoryCode: 'C',
        alerts: [
          { alertType: 'T', alertCode: 'TCPA' },
          { alertType: 'X', alertCode: 'XCU' },
        ],
        imprisonmentStatus: 'UNKNOWN',
        dateOfBirth: '2005-01-01',
      }
      fakePrisonApi.get('/api/offenders/A1234AA').matchHeader('authorization', `Bearer ${token}`).reply(200, result)

      const response = await client.getPrisonerDetails('A1234AA')

      expect(response).toEqual({
        offenderNo: 'A1234AA',
        firstName: 'JOHN',
        lastName: 'SMITH',
        assignedLivingUnit: {
          description: '1-2-015',
        },
        categoryCode: 'C',
        alerts: [
          {
            alertType: 'T',
            alertCode: 'TCPA',
          },
          {
            alertType: 'X',
            alertCode: 'XCU',
          },
        ],
      })
    })
  })
})
