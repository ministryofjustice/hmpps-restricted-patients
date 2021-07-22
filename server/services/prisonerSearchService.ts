import type { PrisonerSearchByName, PrisonerSearchByPrisonerNumber } from '../data/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import PrisonerSearchResult from '../data/prisonerSearchResult'
import { User } from '../data/hmppsAuthClient'

import convertToTitleCase from '../utils/utils'

export interface PrisonerSearchSummary extends PrisonerSearchResult {
  displayName: string
}

// Anything with a number is considered not to be a name, so therefore an identifier (prison no, PNC no etc.)
const isPrisonerIdentifier = (searchTerm: string) => /\d/.test(searchTerm)

function searchByName(searchTerm: string, prisonIds: string[]): PrisonerSearchByName {
  const [lastName, firstName] = searchTerm.split(' ')
  return { lastName, firstName, prisonIds }
}

function searchByPrisonerIdentifier(searchTerm: string, prisonIds: string[]): PrisonerSearchByPrisonerNumber {
  return { prisonerIdentifier: searchTerm.toUpperCase(), prisonIds }
}

export interface PrisonerSearch {
  searchTerm: string
  username: string
  token: string
  authSource: string
}

export default class PrisonerSearchService {
  async search(search: PrisonerSearch, user: User): Promise<PrisonerSearchSummary[]> {
    const { token } = search

    const searchTerm = search.searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()
    const prisonIds = [user.activeCaseLoadId]

    const searchRequest = isPrisonerIdentifier(searchTerm)
      ? searchByPrisonerIdentifier(searchTerm, prisonIds)
      : searchByName(searchTerm, prisonIds)

    const results = await new PrisonerSearchClient(token).search(searchRequest)

    return results.map(prisoner => ({
      ...prisoner,
      displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
    }))
  }
}
