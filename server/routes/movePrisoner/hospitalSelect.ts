import { Request } from 'express'

import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import HospitalSearchService from '../../services/hospitalSearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(hospitalSearchService: HospitalSearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      hospitalSearchService,
      prisonerSearchService,
      '/move-to-hospital/confirm-move',
      'pages/movePrisoner/movePrisonerSelectHospital',
    )
  }

  protected startNewJourneyInSession(req: Request): void {
    req.session.newMovePrisonerJourney = true
  }
}
