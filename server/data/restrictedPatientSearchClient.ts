import { plainToClass } from 'class-transformer'
import { asUser, RestClient } from '@ministryofjustice/hmpps-rest-client'

import config from '../config'
import RestrictedPatientSearchResults from './restrictedPatientSearchResults'
import RestrictedPatientSearchResult from './restrictedPatientSearchResult'
import logger from '../../logger'

export interface RestrictedPatientSearchByPrisonerNumber {
  prisonerIdentifier: string
}

export interface RestrictedPatientSearchByName {
  firstName: string
  lastName: string
}

type RestrictedPatientSearchRequest = RestrictedPatientSearchByPrisonerNumber | RestrictedPatientSearchByName

export default class RestrictedPatientSearchClient extends RestClient {
  constructor() {
    super('Restricted Patient Search', config.apis.prisonerSearch, logger)
  }

  async search(searchRequest: RestrictedPatientSearchRequest, token: string): Promise<RestrictedPatientSearchResult[]> {
    const results = await this.post<RestrictedPatientSearchResults>(
      {
        path: `/restricted-patient-search/match-restricted-patients?size=3000`,
        data: { ...searchRequest },
      },
      asUser(token),
    )

    return results?.content.map(result =>
      plainToClass(RestrictedPatientSearchResult, result, { excludeExtraneousValues: true }),
    )
  }
}
