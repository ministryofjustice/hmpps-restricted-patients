import { Request } from 'express'
import AgencySearchService from '../../services/agencySearchService'
import PrisonSelectRoutes from '../selectPrison/prisonSelect'
import RestrictedPatientSearchService from '../../services/restrictedPatientSearchService'

export default class ChangeSupportingPrisonSelectRoutes extends PrisonSelectRoutes {
  constructor(
    agencySearchService: AgencySearchService,
    restrictedPatientSearchService: RestrictedPatientSearchService,
  ) {
    super(
      agencySearchService,
      restrictedPatientSearchService,
      '/change-supporting-prison',
      'pages/changePrison/changeSupportingPrisonSelect',
    )
  }

  protected startNewJourneyInSession(req: Request): void {
    req.session.newChangeSupportingPrisonJourney = true
  }
}
