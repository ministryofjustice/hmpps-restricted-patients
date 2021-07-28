import PrisonApiClient, { Prison } from '../data/prisonApiClient'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

type Hospital = {
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
}
