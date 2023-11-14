import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'

import { Context } from './context'

export default class MovePrisonerService {
  async dischargePatientToHospital(
    prisonerNumber: string,
    currentPrisonId: string,
    hospitalId: string,
    user: Context,
  ): Promise<unknown> {
    const client = new RestrictedPatientApiClient(user.token)
    const request = {
      offenderNo: prisonerNumber,
      fromLocationId: currentPrisonId,
      hospitalLocationCode: hospitalId,
    }

    return client.dischargePatient(request)
  }
}
