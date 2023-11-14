import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'

import { Context } from './context'

export default class MigratePrisonerService {
  async migrateToHospital(prisonerNumber: string, hospitalId: string, user: Context): Promise<unknown> {
    const client = new RestrictedPatientApiClient(user.token)
    const request = {
      offenderNo: prisonerNumber,
      hospitalLocationCode: hospitalId,
    }

    return client.migratePatient(request)
  }
}
