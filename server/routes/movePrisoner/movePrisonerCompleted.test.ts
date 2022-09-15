import { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes, { mockJwtDecode } from '../testutils/appSetup'
import PrisonerSearchService, { PrisonerResultSummary } from '../../services/prisonerSearchService'
import MovePrisonerService, { Hospital } from '../../services/movePrisonerService'

jest.mock('../../services/prisonerSearchService')
jest.mock('../../services/movePrisonerService')

const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>
const movePrisonerService = new MovePrisonerService(null) as jest.Mocked<MovePrisonerService>

let app: Express

describe('GET /prisoner-moved-to-hospital', () => {
  beforeEach(() => {
    app = appWithAllRoutes({
      production: false,
      services: { prisonerSearchService, movePrisonerService },
      session: { newMovePrisonerJourney: true },
      roles: ['TRANSFER_RESTRICTED_PATIENT'],
    })

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
  it('should load the prisoner move completed page', () => {
    return request(app)
      .get('/move-to-hospital/prisoner-moved-to-hospital?prisonerNumber=A1234AA&hospitalId=SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('John Smith has been moved to Sheffield Hospital')
        expect(res.text).toContain('John Smith’s prison number is A1234AA')
      })
  })

  it('should render not found page if user missing privileges', () => {
    mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
    return request(app)
      .get('/move-to-hospital/prisoner-moved-to-hospital?prisonerNumber=A1234AA&hospitalId=SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})
describe('GET /prisoner-moved-to-hospital - no session item (user jumped to page)', () => {
  beforeEach(() => {
    app = appWithAllRoutes({ production: false, services: { prisonerSearchService, movePrisonerService } })

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
  it('should load the prisoner move completed page', () => {
    return request(app)
      .get('/move-to-hospital/prisoner-moved-to-hospital?prisonerNumber=A1234AA&hospitalId=SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render not found page if user missing privileges', () => {
    mockJwtDecode.mockImplementation(() => ({ authorities: ['SEARCH_RESTRICTED_PATIENT'] }))
    return request(app)
      .get('/move-to-hospital/prisoner-moved-to-hospital?prisonerNumber=A1234AA&hospitalId=SHEFF')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })
})