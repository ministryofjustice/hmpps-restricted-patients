import HospitalSelectRoutes from '../selectHospital/hospitalSelect'
import HospitalSearchService from '../../services/hospitalSearchService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class AddPatientHospitalSelectRoutes extends HospitalSelectRoutes {
  constructor(hospitalSearchService: HospitalSearchService, prisonerSearchService: PrisonerSearchService) {
    super(
      hospitalSearchService,
      prisonerSearchService,
      '/add-restricted-patient/confirm-add',
      'pages/addPatient/addPatientSelectHospital'
    )
  }
}
