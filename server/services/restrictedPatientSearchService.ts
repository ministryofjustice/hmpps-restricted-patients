import type {
  RestrictedPatientSearchByName,
  RestrictedPatientSearchByPrisonerNumber,
} from '../data/restrictedPatientSearchClient'
import RestrictedPatientSearchClient from '../data/restrictedPatientSearchClient'
import RestrictedPatientSearchResult from '../data/restrictedPatientSearchResult'

import { convertToTitleCase } from '../utils/utils'

import { Context } from './context'
import PrisonApiClient, { Agency } from '../data/prisonApiClient'

export interface RestrictedPatientSearchSummary extends RestrictedPatientSearchResult {
  displayName: string
}

// Anything with a number is considered not to be a name, so therefore an identifier (prison no, PNC no etc.)
const isPrisonerIdentifier = (searchTerm: string) => /\d/.test(searchTerm)

function searchByName(searchTerm: string): RestrictedPatientSearchByName {
  const [lastName, firstName] = searchTerm.split(' ')
  return { lastName, firstName }
}

function searchByPrisonerIdentifier(searchTerm: string): RestrictedPatientSearchByPrisonerNumber {
  return { prisonerIdentifier: searchTerm.toUpperCase() }
}

export interface RestrictedPatientSearchCriteria {
  searchTerm: string
}

export default class RestrictedPatientSearchService {
  async search(search: RestrictedPatientSearchCriteria, user: Context): Promise<RestrictedPatientSearchSummary[]> {
    const searchTerm = search.searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()

    const searchRequest = isPrisonerIdentifier(searchTerm)
      ? searchByPrisonerIdentifier(searchTerm)
      : searchByName(searchTerm)

    const [results, prisons]: [RestrictedPatientSearchResult[], Agency[]] = await Promise.all([
      new RestrictedPatientSearchClient(user.token).search(searchRequest),
      new PrisonApiClient(user.token).getAgenciesByType('INST'),
    ])

    const prisonMap = new Map(prisons.map(i => [i.agencyId, i.description]))

    const enhancedResults = results.map(prisoner => {
      return {
        ...prisoner,
        displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
        supportingPrisonDescription: prisonMap.get(prisoner.supportingPrisonId),
      }
    })

    return enhancedResults.sort((a: RestrictedPatientSearchSummary, b: RestrictedPatientSearchSummary) =>
      a.displayName.localeCompare(b.displayName),
    )
  }
}
