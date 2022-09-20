import RestrictedPatientSearchRoutes from '../searchPatients/restrictedPatientSearch'

export default class ViewPatientsSearchRoutes extends RestrictedPatientSearchRoutes {
  constructor() {
    super('/view-restricted-patients', 'pages/viewPatients/restrictedPatientSearch')
  }
}
