import RestrictedPatientSearchRoutes from '../searchPatients/restrictedPatientSearch'

export default class RemoveRestrictedPatientSearchRoutes extends RestrictedPatientSearchRoutes {
  constructor() {
    super('/remove-from-restricted-patients/select-patient', 'pages/removeRestrictedPatient/patientSearch')
  }
}
