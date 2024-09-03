import { Request } from 'express'

import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import AgencySearchService from '../../services/agencySearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(agencySearchService: AgencySearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      agencySearchService,
      prisonerSearchService,
      '/move-to-hospital/confirm-move',
      'pages/movePrisoner/movePrisonerSelectHospital',
    )
  }

  protected startNewJourneyInSession(req: Request): void {
    req.session.newMovePrisonerJourney = true
  }
}
