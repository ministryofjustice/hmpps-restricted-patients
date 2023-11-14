import PrisonApiClient, { Prison } from '../data/prisonApiClient'

import { Context } from './context'

export type Hospital = {
  agencyId: string
  description: string
  longDescription: string
  agencyType: string
  active: true
}

export default class HospitalSearchService {
  async getHospitals(user: Context): Promise<Prison[]> {
    // agencies endpoint just needs a valid token without any special roles required
    const client = new PrisonApiClient(user.token)

    const [hospitalType, hshospType] = await Promise.all([
      client.getAgenciesByType('HOSPITAL'),
      client.getAgenciesByType('HSHOSP'),
    ])

    return [...hospitalType, ...hshospType]
      .filter(h => h.active)
      .sort((a: Hospital, b: Hospital) => a.description.localeCompare(b.description))
  }

  async getHospital(hospitalId: string, user: Context): Promise<Prison> {
    // agency endpoint just needs a valid token without any special roles required
    const client = new PrisonApiClient(user.token)

    return client.getAgencyDetails(hospitalId)
  }
}
