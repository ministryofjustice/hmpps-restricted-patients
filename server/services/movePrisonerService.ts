import PrisonApiClient, { Prison } from '../data/prisonApiClient'
import RestrictedPatientApiClient from '../data/restrictedPatientApiClient'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

export type Hospital = {
  agencyId: string
  description: string
  longDescription: string
  agencyType: string
  active: true
}

export default class MovePrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getHospitals(user: User): Promise<Prison[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const client = new PrisonApiClient(token)

    const [hospitalType, hshospType] = await Promise.all([
      client.getAgenciesByType('HOSPITAL'),
      client.getAgenciesByType('HSHOSP'),
    ])

    const sortedHospitals = [...hospitalType, ...hshospType].sort((a: Hospital, b: Hospital) =>
      a.description.localeCompare(b.description)
    )

    return sortedHospitals
  }

  async getHospital(hospitalId: string, user: User): Promise<Prison> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const client = new PrisonApiClient(token)

    return client.getAgencyDetails(hospitalId)
  }

  async dischargePatientToHospital(prisonerNumber: string, currentPrisonId: string, hospitalId: string, user: User) {
    const client = new RestrictedPatientApiClient(user.token)
    const request = {
      // TODO - Confirm supportingPrisonId, date, commentText
      // TODO - Needs role RELEASE_PRISONER
      offenderNo: prisonerNumber,
      //      commentText: 'test comment text',
      dischargeTime: new Date(),
      fromLocationId: currentPrisonId,
      hospitalLocationCode: hospitalId,
      supportingPrisonId: currentPrisonId,
    }

    return client.dischargePatient(request)
  }
}
