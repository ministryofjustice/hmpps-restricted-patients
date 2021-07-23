import { Readable } from 'stream'
import type { PrisonerSearchByName, PrisonerSearchByPrisonerNumber } from '../data/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import PrisonApiClient from '../data/prisonApiClient'
import PrisonerSearchResult, { AlertType } from '../data/prisonerSearchResult'
import { User } from '../data/hmppsAuthClient'

import { alertFlagLabels } from '../common/alertFlagValues'
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
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async search(search: PrisonerSearch, user: User): Promise<PrisonerSearchSummary[]> {
    const { token } = search

    const searchTerm = search.searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()
    const prisonIds = [user.activeCaseLoadId]

    const searchRequest = isPrisonerIdentifier(searchTerm)
      ? searchByPrisonerIdentifier(searchTerm, prisonIds)
      : searchByName(searchTerm, prisonIds)

    const results = await new PrisonerSearchClient(token).search(searchRequest)

    return results.map(prisoner => {
      const prisonerAlerts = prisoner.alerts?.map((alert: AlertType) => alert.alertCode)

      return {
        ...prisoner,
        displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
        formattedAlerts: alertFlagLabels.filter(alertFlag =>
          alertFlag.alertCodes.some(alert => prisonerAlerts?.includes(alert))
        ),
      }
    })
  }

  async getPrisonerImage(prisonerNumber: string, user: User): Promise<Readable> {
    const { token } = user
    return new PrisonApiClient(token).getPrisonerImage(prisonerNumber)
  }
}
