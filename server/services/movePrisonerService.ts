import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import { User } from '../data/hmppsAuthClient'

export default class MovePrisonerService {
  async dischargePatientToHospital(
    prisonerNumber: string,
    currentPrisonId: string,
    hospitalId: string,
    user: User
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
