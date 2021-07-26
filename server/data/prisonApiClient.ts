import type { Readable } from 'stream'

import config from '../config'
import logger from '../../logger'
import RestClient from './restClient'

export interface Prison {
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

  async getPrisonerImage(prisonerNumber: string): Promise<Readable> {
    return this.restClient.stream({
      path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
      errorLogger: error =>
        error.status === 404
          ? logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)
          : this.restClient.defaultErrorLogger(error),
    }) as Promise<Readable>
  }
}
