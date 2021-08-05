import config from '../config'
import RestClient from './restClient'

export interface RestrictedPatientDischargeToHospitalRequest {
  offenderNo: string
  commentText?: string
  dischargeTime: Date
  fromLocationId: string
  hospitalLocationCode: string
  supportingPrisonId?: string
}

export default class RestrictedPatientApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Resricted Patient', config.apis.restrictedPatientApi, token)
  }

  async dischargePatient(searchRequest: RestrictedPatientDischargeToHospitalRequest): Promise<unknown> {
    const results = await this.restClient.post<RestrictedPatientDischargeToHospitalRequest>({
      path: `/discharge-to-hospital`,
      data: { ...searchRequest },
    })

    return results
  }
}
