import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class AddPatientHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(movePrisonerService: MovePrisonerService, prisonerSearchService: PrisonerSearchService) {
    super(
      movePrisonerService,
      prisonerSearchService,
      '/add-restricted-patient/confirm-add',
      'pages/addPatient/addPatientSelectHospital'
    )
  }
}
