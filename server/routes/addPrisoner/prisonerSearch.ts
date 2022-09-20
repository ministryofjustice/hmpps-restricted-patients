import PrisonerSearchRoutes from '../searchPrisoners/prisonerSearch'

export default class AddPrisonerSearchRoutes extends PrisonerSearchRoutes {
  constructor() {
    super('/add-restricted-patient/select-prisoner', 'pages/releasedPrisonerSearch')
  }
}
