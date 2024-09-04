import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonApiClient from '../data/prisonApiClient'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import { convertToTitleCase } from '../utils/utils'

import { Context } from './context'
import RestrictedPatientResult from '../data/restrictedPatientResult'
import PrisonerResult from '../data/prisonerResult'

export interface RestrictedPatientDetails {
  displayName: string
  friendlyName: string
  hospital: string
  prisonerNumber: string
}

export default class RemoveRestrictedPatientService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async removeRestrictedPatient(prisonerNumber: string, user: Context): Promise<Record<string, unknown>> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const client = new RestrictedPatientApiClient(token)

    return client.removePatient(prisonerNumber)
  }

  async getRestrictedPatient(prisonerNumber: string, user: Context): Promise<RestrictedPatientDetails> {
    const [patientDetails, prisonerDetails]: [RestrictedPatientResult, PrisonerResult] = await Promise.all([
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
