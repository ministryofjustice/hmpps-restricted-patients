import { plainToClass } from 'class-transformer'
import type { Readable } from 'stream'
import { ApiConfig, AuthOptions, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'

import config from '../config'
import logger from '../../logger'
import PrisonerResult from './prisonerResult'

export interface Agency {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

export default class PrisonApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prison API', config.apis.prisonApi as ApiConfig, logger, authenticationClient)
  }

  getPrisonerImage(prisonerNumber: string, authOptions: AuthOptions): Promise<Readable> {
    return this.stream(
      {
        path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
        errorLogger: (path, method, error) => {
          if (error.responseStatus === 404) {
            logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)
          } else {
            this.logError(path, method, error)
          }
        },
      },
      authOptions,
    ) as Promise<Readable>
  }

  getAgenciesByType(type: string, authOptions: AuthOptions, active = true): Promise<Agency[]> {
    return this.get<Agency[]>(
      {
        path: `/api/agencies/type/${type}?active=${active}`,
      },
      authOptions,
    )
  }

  getAgencyDetails(id: string, authOptions: AuthOptions): Promise<Agency> {
    return this.get<Agency>(
      {
        path: `/api/agencies/${id}`,
      },
      authOptions,
    )
  }

  async getPrisonerDetails(prisonerNumber: string, authOptions: AuthOptions): Promise<PrisonerResult> {
    const result = await this.get<PrisonerResult>(
      {
        path: `/api/offenders/${prisonerNumber}`,
      },
      authOptions,
    )

    return plainToClass(PrisonerResult, result, { excludeExtraneousValues: true })
  }
}
