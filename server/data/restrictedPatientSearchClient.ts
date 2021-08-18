import { plainToClass } from 'class-transformer'
import config from '../config'
import RestClient from './restClient'
import RestrictedPatientSearchResults from './restrictedPatientSearchResults'
import RestrictedPatientSearchResult from './restrictedPatientSearchResult'

export interface RestrictedPatientSearchByPrisonerNumber {
  prisonerIdentifier: string
}

export interface RestrictedPatientSearchByName {
  firstName: string
  lastName: string
}

type RestrictedPatientSearchRequest = RestrictedPatientSearchByPrisonerNumber | RestrictedPatientSearchByName

export default class RestrictedPatientSearchClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Restricted Patient Search', config.apis.prisonerSearch, token)
  }

  async search(searchRequest: RestrictedPatientSearchRequest): Promise<RestrictedPatientSearchResult[]> {
    const results = await this.restClient.post<RestrictedPatientSearchResults>({
      path: `/restricted-patient-search/match-restricted-patients?size=3000`,
      data: { ...searchRequest },
    })

    return results?.content.map(result =>
      plainToClass(RestrictedPatientSearchResult, result, { excludeExtraneousValues: true })
    )
  }
}
