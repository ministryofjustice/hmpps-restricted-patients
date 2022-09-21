import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import HospitalSearchService from '../../services/hospitalSearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(hospitalSearchService: HospitalSearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      hospitalSearchService,
      prisonerSearchService,
      '/move-to-hospital/confirm-move',
      'pages/movePrisoner/movePrisonerSelectHospital'
    )
  }
}
