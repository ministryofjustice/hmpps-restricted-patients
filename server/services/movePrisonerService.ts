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

  async changeSupportingPrison(prisonerNumber: string, newPrisonId: string, user: Context): Promise<unknown> {
    const client = new RestrictedPatientApiClient(user.token)
    const request = {
      offenderNo: prisonerNumber,
      prisonId: newPrisonId,
    }

    return client.changeSupportingPrison(request)
  }
}
