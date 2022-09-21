import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import { User } from '../data/hmppsAuthClient'

export default class MigratePrisonerService {
  async migrateToHospital(prisonerNumber: string, hospitalId: string, user: User): Promise<unknown> {
    const client = new RestrictedPatientApiClient(user.token)
    const request = {
      offenderNo: prisonerNumber,
      hospitalLocationCode: hospitalId,
    }

    return client.migratePatient(request)
  }
}
