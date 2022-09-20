import RestrictedPatientSearchRoutes from '../searchPatients/restrictedPatientSearch'

export default class MovePrisonerSearchRoutes extends RestrictedPatientSearchRoutes {
  constructor() {
    super('/move-to-hospital/select-prisoner', 'pages/movePrisoner/prisonerSearch')
  }
}
