import RestrictedPatientSearchRoutes from '../searchPatients/restrictedPatientSearch'

export default class ChangeRestrictedPatientSearchRoutes extends RestrictedPatientSearchRoutes {
  constructor() {
    super('/change-supporting-prison/select-patient', 'pages/viewPatients/restrictedPatientSearch')
  }
}
