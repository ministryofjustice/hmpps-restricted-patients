import PrisonApiClient, { Prison } from '../data/prisonApiClient'

import { Context } from './context'

export default class AgencySearchService {
  async getHospitals(user: Context): Promise<Prison[]> {
    // agencies endpoint just needs a valid token without any special roles required
    const client = new PrisonApiClient(user.token)

    const [hospitalType, hshospType]: [Prison[], Prison[]] = await Promise.all([
      client.getAgenciesByType('HOSPITAL'),
      client.getAgenciesByType('HSHOSP'),
    ])

    return [...hospitalType, ...hshospType]
      .filter(h => h.active)
      .sort((a: Prison, b: Prison) => a.description.localeCompare(b.description))
  }

  async getPrisons(user: Context): Promise<Prison[]> {
    // agencies endpoint just needs a valid token without any special roles required
    const client = new PrisonApiClient(user.token)

    const prisons = await client.getAgenciesByType('INST')

    return prisons.filter(h => h.active).sort((a: Prison, b: Prison) => a.description.localeCompare(b.description))
  }

  async getAgency(agencyId: string, user: Context): Promise<Prison> {
    // agency endpoint just needs a valid token without any special roles required
    const client = new PrisonApiClient(user.token)

    return client.getAgencyDetails(agencyId)
  }
}
