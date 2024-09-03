import { Request } from 'express'
import AgencySearchService from '../../services/agencySearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import PrisonSelectRoutes from '../selectPrison/prisonSelect'

export default class ChangeSupportingPrisonSelectRoutes extends PrisonSelectRoutes {
  constructor(agencySearchService: AgencySearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      agencySearchService,
      prisonerSearchService,
      '/change-supporting-prison/confirm-change',
      'pages/changePrison/changeSupportingPrisonSelect',
    )
  }

  protected startNewJourneyInSession(req: Request): void {
    req.session.newChangeSupportingPrisonJourney = true
  }
}
