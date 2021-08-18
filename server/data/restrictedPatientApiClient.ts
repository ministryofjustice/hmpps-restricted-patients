import { plainToClass } from 'class-transformer'
import config from '../config'
import RestClient from './restClient'
import RestrictedPatientResult from './restrictedPatientResult'

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
    this.restClient = new RestClient('Restricted Patient', config.apis.restrictedPatientApi, token)
  }

  async dischargePatient(searchRequest: RestrictedPatientDischargeToHospitalRequest): Promise<unknown> {
    const results = await this.restClient.post<RestrictedPatientDischargeToHospitalRequest>({
      path: `/discharge-to-hospital`,
      data: { ...searchRequest },
    })

    return results
  }

  async getPatient(prisonerNumber: string): Promise<RestrictedPatientResult> {
    const response = await this.restClient.get<RestrictedPatientResult>({
      path: `/restricted-patient/prison-number/${prisonerNumber}`,
    })

    return plainToClass(RestrictedPatientResult, response, { excludeExtraneousValues: true })
  }

  async removePatient(prisonerNumber: string): Promise<Record<string, unknown>> {
    const response = await this.restClient.delete<Record<string, unknown>>({
      path: `/restricted-patient/prison-number/${prisonerNumber}`,
    })

    return response
  }
}
