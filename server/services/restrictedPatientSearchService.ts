import { Readable } from 'stream'
import type {
  RestrictedPatientSearchByName,
  RestrictedPatientSearchByPrisonerNumber,
} from '../data/restrictedPatientSearchClient'
import RestrictedPatientSearchClient from '../data/restrictedPatientSearchClient'
import RestrictedPatientSearchResult from '../data/restrictedPatientSearchResult'
import { AlertType } from '../data/prisonerSearchResult'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

import { alertFlagLabels, FormattedAlertType } from '../common/alertFlagValues'
import convertToTitleCase from '../utils/utils'

export interface RestrictedPatientSearchSummary extends RestrictedPatientSearchResult {
  displayName: string
  formattedAlerts: FormattedAlertType[]
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
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async search(search: RestrictedPatientSearchCriteria, user: User): Promise<RestrictedPatientSearchSummary[]> {
    const searchTerm = search.searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()

    const searchRequest = isPrisonerIdentifier(searchTerm)
      ? searchByPrisonerIdentifier(searchTerm)
      : searchByName(searchTerm)

    const results = await new RestrictedPatientSearchClient(user.token).search(searchRequest)

    const enhancedResults = results.map(prisoner => {
      const prisonerAlerts = prisoner.alerts?.map((alert: AlertType) => alert.alertCode)

      return {
        ...prisoner,
        displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
        formattedAlerts: alertFlagLabels.filter(alertFlag =>
          alertFlag.alertCodes.some(alert => prisonerAlerts?.includes(alert))
        ),
      }
    })

    return enhancedResults.sort((a: RestrictedPatientSearchSummary, b: RestrictedPatientSearchSummary) =>
      a.displayName.localeCompare(b.displayName)
    )
  }
}
