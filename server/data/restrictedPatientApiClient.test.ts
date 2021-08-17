import 'reflect-metadata'
import nock from 'nock'
import config from '../config'
import RestrictedPatientApiClient, { RestrictedPatientDischargeToHospitalRequest } from './restrictedPatientApiClient'

describe('restrictedPatientSearchClient', () => {
  let fakeRestrictedPatientApi: nock.Scope
  let client: RestrictedPatientApiClient

  const token = 'token-1'

  const request = {
    offenderNo: 'A1234AA',
    dischargeTime: new Date('2019-05-14T11:01:58.135Z'),
    fromLocationId: 'MDI',
    hospitalLocationCode: 'SHEFF',
    supportingPrisonId: 'MDI',
  } as RestrictedPatientDischargeToHospitalRequest

  beforeEach(() => {
    fakeRestrictedPatientApi = nock(config.apis.restrictedPatientApi.url)
    client = new RestrictedPatientApiClient(token)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('dischargePatient', () => {
    it('makes the correct call and returns the response', async () => {
      const results: unknown = { restrictivePatient: { supportingPrisonId: 'MDI' } }
      fakeRestrictedPatientApi
        .post(`/discharge-to-hospital`, JSON.stringify(request))
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, results)

      const output = await client.dischargePatient(request)

      expect(output).toEqual(results)
    })

    it('throws an error on 500', async () => {
      fakeRestrictedPatientApi
        .persist()
        .post(`/discharge-to-hospital`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(500)

      await client
        .dischargePatient(request)
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Should not get here')
        })
        .catch(error => {
          expect(error.message).toEqual('Internal Server Error')
          nock.cleanAll()
        })
    })
  })

  describe('getPatient', () => {
    it('makes the correct call and returns the response', async () => {
      const result = {
        hospitalLocation: {
          description: 'Sheffield Hospital',
        },
        prisonerNumber: 'A1234AA',
      }

      fakeRestrictedPatientApi
        .get('/restricted-patient/prison-number/A1234AA')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, result)

      const response = await client.getPatient('A1234AA')

      expect(response).toEqual({
        hospitalLocation: {
          description: 'Sheffield Hospital',
        },
      })
    })
  })

  describe('removePatient', () => {
    it('works', async () => {
      fakeRestrictedPatientApi
        .delete('/restricted-patient/prison-number/A1234AA')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200)

      const response = await client.removePatient('A1234AA')

      expect(response).toEqual({})
    })
  })
})
