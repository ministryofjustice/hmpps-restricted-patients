import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(movePrisonerService: MovePrisonerService, prisonerSearchService: PrisonerSearchService) {
    super(
      movePrisonerService,
      prisonerSearchService,
      '/move-to-hospital/confirm-move',
      'pages/movePrisoner/movePrisonerSelectHospital'
    )
  }
}
