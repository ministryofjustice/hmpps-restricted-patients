import { plainToClass } from 'class-transformer'
import config from '../config'
import RestClient from './restClient'
import RestrictedPatientResult from './restrictedPatientResult'

export interface RestrictedPatientDischargeToHospitalRequest {
  offenderNo: string
  commentText?: string
  fromLocationId: string
  hospitalLocationCode: string
  supportingPrisonId?: string
}
export interface RestrictedPatientAddRequest {
  offenderNo: string
  hospitalLocationCode: string
}
export interface ChangeSupportingPrisonRequest {
  offenderNo: string
  supportingPrisonId: string
}

export default class RestrictedPatientApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Restricted Patient', config.apis.restrictedPatientApi, token)
  }

  async dischargePatient(searchRequest: RestrictedPatientDischargeToHospitalRequest): Promise<unknown> {
    return this.restClient.post<RestrictedPatientDischargeToHospitalRequest>({
      path: `/discharge-to-hospital`,
      data: { ...searchRequest },
    })
  }

  async migratePatient(searchRequest: RestrictedPatientAddRequest): Promise<unknown> {
    return this.restClient.post<RestrictedPatientAddRequest>({
      path: `/migrate-in-restricted-patient`,
      data: { ...searchRequest },
    })
  }

  async getPatient(prisonerNumber: string): Promise<RestrictedPatientResult> {
    const response = await this.restClient.get<RestrictedPatientResult>({
      path: `/restricted-patient/prison-number/${prisonerNumber}`,
    })

    return plainToClass(RestrictedPatientResult, response, { excludeExtraneousValues: true })
  }

  async removePatient(prisonerNumber: string): Promise<Record<string, unknown>> {
    return this.restClient.delete<Record<string, unknown>>({
      path: `/restricted-patient/prison-number/${prisonerNumber}`,
    })
  }

  async changeSupportingPrison(searchRequest: ChangeSupportingPrisonRequest): Promise<unknown> {
    return this.restClient.post<ChangeSupportingPrisonRequest>({
      path: `/change-supporting-prison`,
      data: { ...searchRequest },
    })
  }
}
