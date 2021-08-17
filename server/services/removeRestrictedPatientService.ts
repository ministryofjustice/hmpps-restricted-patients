import HmppsAuthClient, { User } from '../data/hmppsAuthClient'
import PrisonApiClient from '../data/prisonApiClient'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import convertToTitleCase from '../utils/utils'

export interface RestrictedPatientDetails {
  displayName: string
  friendlyName: string
  hospital: string
  prisonerNumber: string
}

export default class RemoveRestrictedPatientService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async removeRestrictedPatient(prisonerNumber: string, user: User): Promise<Record<string, unknown>> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const client = new RestrictedPatientApiClient(token)

    return client.removePatient(prisonerNumber)
  }

  async getRestrictedPatient(prisonerNumber: string, user: User): Promise<RestrictedPatientDetails> {
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
