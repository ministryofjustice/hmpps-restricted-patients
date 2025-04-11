import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'

import { Context } from './context'

export default class MigratePrisonerService {
  constructor(private readonly restrictedPatientApiClient: RestrictedPatientApiClient) {}

  async migrateToHospital(prisonerNumber: string, hospitalId: string, user: Context): Promise<unknown> {
    const request = {
      offenderNo: prisonerNumber,
      hospitalLocationCode: hospitalId,
    }

    return this.restrictedPatientApiClient.migratePatient(request, user.token)
  }
}
