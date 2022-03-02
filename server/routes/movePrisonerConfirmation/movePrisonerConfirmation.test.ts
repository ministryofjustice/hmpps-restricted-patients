import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from '../testutils/appSetup'
import PrisonerSearchService, { PrisonerResultSummary } from '../../services/prisonerSearchService'
import MovePrisonerService, { Hospital } from '../../services/movePrisonerService'
import { raiseAnalyticsEvent } from '../../raiseAnalyticsEvent'

jest.mock('../../services/prisonerSearchService')
jest.mock('../../services/movePrisonerService')
jest.mock('../../raiseAnalyticsEvent', () => ({
  raiseAnalyticsEvent: jest.fn(),
}))

const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>
const movePrisonerService = new MovePrisonerService(null) as jest.Mocked<MovePrisonerService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ production: false }, { prisonerSearchService, movePrisonerService })

  movePrisonerService.getHospital.mockResolvedValue({
    agencyId: 'SHEFF',
    description: 'Sheffield Hospital',
    longDescription: 'Sheffield Teaching Hospital',
    agencyType: 'HOSP',
    active: true,
  } as Hospital)
  prisonerSearchService.getPrisonerDetails.mockResolvedValue({
    assignedLivingUnit: {
      agencyId: 'MDI',
      description: '1-2-015',
    },
    alerts: [
      { alertType: 'T', alertCode: 'TCPA' },
      { alertType: 'X', alertCode: 'XCU' },
    ],
    displayName: 'Smith, John',
    formattedAlerts: [
      {
        alertCodes: ['XCU'],
        classes: 'alert-status alert-status--controlled-unlock',
        label: 'Controlled unlock',
      },
    ],
    friendlyName: 'John Smith',
    prisonerNumber: 'A1234AA',
  } as PrisonerResultSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /confirm-move', () => {
  it('should load the confirm move page', () => {
    return request(app)
      .get('/confirm-move/A1234AA/SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('You are moving John Smith to Sheffield Hospital')
        expect(res.text).toContain('<input type="hidden" name="currentAgencyId" value="MDI"')
      })
  })
})

describe('POST /confirm-move', () => {
  it('should redirect to prisoner-moved page on success', () => {
    movePrisonerService.dischargePatientToHospital.mockResolvedValue({
      restrictivePatient: {
        supportingPrison: 'MDI',
      },
    })

    return request(app)
      .post('/confirm-move/A1234AA/SHEFF')
      .send({ currentAgencyId: 'MDI' })
      .expect('Location', '/prisoner-moved-to-hospital/A1234AA/SHEFF')
  })
  it('should raise an analytics event', async () => {
    movePrisonerService.dischargePatientToHospital.mockResolvedValue({
      restrictivePatient: {
        supportingPrison: 'MDI',
      },
    })

    await request(app).post('/confirm-move/A1234AA/SHEFF').send({ currentAgencyId: 'MDI' })

    expect(raiseAnalyticsEvent).toBeCalledWith(
      'Restricted Patients',
      'Prisoner moved to hospital',
      'Prisoner moved from MDI to SHEFF'
    )
  })

  it('should throw an error on failure', () => {
    movePrisonerService.dischargePatientToHospital.mockRejectedValue(new Error('some error'))

    return request(app)
      .post('/confirm-move/A1234AA/SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Error: some error')
      })
  })
})
