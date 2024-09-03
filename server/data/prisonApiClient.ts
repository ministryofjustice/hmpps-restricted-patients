import { plainToClass } from 'class-transformer'
import type { Readable } from 'stream'

import config from '../config'
import logger from '../../logger'
import RestClient from './restClient'
import PrisonerResult from './prisonerResult'

export interface Agency {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

export default class PrisonApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prison API', config.apis.prison, token)
  }

  getPrisonerImage(prisonerNumber: string): Promise<Readable> {
    return this.restClient.stream({
      path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
      errorLogger: error =>
        error.status === 404
          ? logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)
          : this.restClient.defaultErrorLogger(error),
    }) as Promise<Readable>
  }

  getAgenciesByType(type: string, active = true): Promise<Agency[]> {
    return this.restClient.get<Agency[]>({
      path: `/api/agencies/type/${type}?active=${active}`,
    })
  }

  getAgencyDetails(id: string): Promise<Agency> {
    return this.restClient.get<Agency>({
      path: `/api/agencies/${id}`,
    })
  }

  async getPrisonerDetails(prisonerNumber: string): Promise<PrisonerResult> {
    const result = await this.restClient.get<PrisonerResult>({
      path: `/api/offenders/${prisonerNumber}`,
    })

    return plainToClass(PrisonerResult, result, { excludeExtraneousValues: true })
  }
}
