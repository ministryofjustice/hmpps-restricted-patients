import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from '../testutils/appSetup'
import PrisonerSearchService, { PrisonerResultSummary } from '../../services/prisonerSearchService'

jest.mock('../../services/prisonerSearchService')

const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>

let app: Express

describe('GET /patient-removed', () => {
  beforeEach(() => {
    app = appWithAllRoutes({
      production: false,
      services: { prisonerSearchService },
      session: { newRemoveRestrictedPatientJourney: true },
    })

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
  it('should load the prisoner move completed page', () => {
    return request(app)
      .get('/remove-from-restricted-patients/patient-removed?prisonerNumber=A1234AA')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('John Smith has been removed from restricted patients')
      })
  })
})

describe('GET /patient-removed - no session item (user jumped to page)', () => {
  beforeEach(() => {
    app = appWithAllRoutes({ production: false, services: { prisonerSearchService } })

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
  it('should load the prisoner move completed page', () => {
    return request(app)
      .get('/remove-from-restricted-patients/patient-removed?prisonerNumber=A1234AA')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})
