import { User } from '../data/hmppsAuthClient'
import PrisonApiClient from '../data/prisonApiClient'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import convertToTitleCase from '../utils/utils'

export default class RemoveRestrictedPatientService {
  async removeRestrictedPatient(prisonerNumber: string, user: User): Promise<unknown> {
    const client = new RestrictedPatientApiClient(user.token)

    return client.removePatient(prisonerNumber)
  }

  async getRestrictedPatient(prisonerNumber: string, user: User): Promise<unknown> {
    const [patientDetails, prisonerDetails] = await Promise.all([
      new RestrictedPatientApiClient(user.token).getPatient(prisonerNumber),
      new PrisonApiClient(user.token).getPrisonerDetails(prisonerNumber),
    ])

    return {
      displayName: convertToTitleCase(`${prisonerDetails.lastName}, ${prisonerDetails.firstName}`),
      friendlyName: convertToTitleCase(`${prisonerDetails.firstName} ${prisonerDetails.lastName}`),
      hospital: patientDetails?.hospitalLocation?.description,
      prisonerNumber,
    }
  }
}
