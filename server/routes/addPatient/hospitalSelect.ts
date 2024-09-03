import { Request } from 'express'
import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import AgencySearchService from '../../services/agencySearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class AddPatientHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(agencySearchService: AgencySearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      agencySearchService,
      prisonerSearchService,
      '/add-restricted-patient/confirm-add',
      'pages/addPatient/addPatientSelectHospital',
    )
  }

  protected startNewJourneyInSession(req: Request): void {
    req.session.newAddRestrictedPatientJourney = true
  }
}
