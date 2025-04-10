import { ApiConfig, asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import { plainToClass } from 'class-transformer'
import config from '../config'
import PrisonerSearchResult from './prisonerSearchResult'
import logger from '../../logger'

export interface PrisonerSearchByPrisonerNumber {
  prisonerIdentifier: string
  prisonIds?: string[]
  includeAliases?: boolean
}

export interface PrisonerSearchByName {
  firstName: string
  lastName: string
  prisonIds?: string[]
  includeAliases?: boolean
}

type PrisonerSearchRequest = PrisonerSearchByPrisonerNumber | PrisonerSearchByName

export default class PrisonerSearchClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prisoner Search', config.apis.prisonerSearch as ApiConfig, logger, authenticationClient)
  }

  async search(searchRequest: PrisonerSearchRequest, username: string): Promise<PrisonerSearchResult[]> {
    const results = await this.post<PrisonerSearchResult[]>(
      {
        path: `/prisoner-search/match-prisoners`,
        data: {
          includeAliases: false,
          ...searchRequest,
        },
      },
      asSystem(username),
    )

    return results.map(result => plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }))
  }
}
