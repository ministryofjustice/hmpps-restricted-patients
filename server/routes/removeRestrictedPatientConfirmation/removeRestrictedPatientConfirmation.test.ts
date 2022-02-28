import { Express } from 'express'
import request from 'supertest'
import RemoveRestrictedPatientService, { RestrictedPatientDetails } from '../../services/removeRestrictedPatientService'
import appWithAllRoutes from '../testutils/appSetup'
import { raiseAnalyticsEvent } from '../../raiseAnalyticsEvent'

jest.mock('../../services/removeRestrictedPatientService')
jest.mock('../../raiseAnalyticsEvent', () => ({
  raiseAnalyticsEvent: jest.fn(),
}))

const removeRestrictedPatientService = new RemoveRestrictedPatientService(
  null
) as jest.Mocked<RemoveRestrictedPatientService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false }, { removeRestrictedPatientService })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('/remove-from-restricted-patients', () => {
  beforeEach(() => {
    removeRestrictedPatientService.getRestrictedPatient.mockResolvedValue({
      displayName: 'Smith, John',
      friendlyName: 'John Smith',
      hospital: 'Sheffield Hospital',
      prisonerNumber: 'A1234AA',
    } as RestrictedPatientDetails)
  })

  describe('GET /remove-from-restricted-patients', () => {
    it('should load the remove from restricted patients selection playback page', () => {
      return request(app)
        .get('/remove-from-restricted-patients/A1234AA')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('You are removing John Smith from restricted patients')
        })
    })
  })

  describe('POST /remove-from-restricted-patients', () => {
    describe('with a successful response', () => {
      beforeEach(() => {
        removeRestrictedPatientService.removeRestrictedPatient.mockResolvedValue({})
      })

      it('should redirect to the person moved confirmation page', () => {
        return request(app)
          .post('/remove-from-restricted-patients/A1234AA')
          .expect('Location', '/person-removed/A1234AA')
      })
    })

    it('should raise an analytics event', async () => {
      removeRestrictedPatientService.removeRestrictedPatient.mockResolvedValue({})

      await request(app).post('/remove-from-restricted-patients/A1234AA').expect('Location', '/person-removed/A1234AA')

      expect(raiseAnalyticsEvent).toBeCalledWith(
        'Restricted Patients',
        'Restricted patient removed',
        'Restricted patient removed from Sheffield Hospital'
      )
    })

    describe('when there has been an error', () => {
      beforeEach(() => {
        removeRestrictedPatientService.removeRestrictedPatient.mockRejectedValue(new Error('some error'))
      })

      it('should throw the error', () => {
        return request(app)
          .post('/remove-from-restricted-patients/A1234AA')
          .expect('Content-Type', /html/)
          .expect(res => {
            expect(res.text).toContain('Error: some error')
          })
      })
    })
  })
})
