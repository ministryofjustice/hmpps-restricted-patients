import { Readable } from 'stream'
import type { PrisonerSearchByName, PrisonerSearchByPrisonerNumber } from '../data/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import PrisonApiClient from '../data/prisonApiClient'
import PrisonerSearchResult from '../data/prisonerSearchResult'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

import { FormattedAlertType, getFormattedAlerts } from '../common/alertFlagValues'
import { convertToTitleCase } from '../utils/utils'
import PrisonerResult from '../data/prisonerResult'

export interface PrisonerSearchSummary extends PrisonerSearchResult {
  displayName: string
  formattedAlerts: FormattedAlertType[]
}

export interface PrisonerResultSummary extends PrisonerResult {
  displayName: string
  formattedAlerts: FormattedAlertType[]
  friendlyName: string
  prisonerNumber: string
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
  prisonIds: string[]
  searchTerm: string
}

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static enhancePrisoner(prisoner: PrisonerSearchResult | PrisonerResult) {
    return {
      displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
      formattedAlerts: getFormattedAlerts(prisoner.alerts),
    }
  }

  async search(search: PrisonerSearch, user: User): Promise<PrisonerSearchSummary[]> {
    const searchTerm = search.searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()
    const { prisonIds } = search

    const searchRequest = isPrisonerIdentifier(searchTerm)
      ? searchByPrisonerIdentifier(searchTerm, prisonIds)
      : searchByName(searchTerm, prisonIds)

    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const results = await new PrisonerSearchClient(token).search(searchRequest)

    const enhancedResults = results.map(prisoner => {
      return {
        ...prisoner,
        ...PrisonerSearchService.enhancePrisoner(prisoner),
      }
    })

    return enhancedResults.sort((a: PrisonerSearchSummary, b: PrisonerSearchSummary) =>
      a.displayName.localeCompare(b.displayName)
    )
  }

  async getPrisonerImage(prisonerNumber: string, user: User): Promise<Readable> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    return new PrisonApiClient(token).getPrisonerImage(prisonerNumber)
  }

  async getPrisonerDetails(prisonerNumber: string, user: User): Promise<PrisonerResultSummary> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const prisoner = await new PrisonApiClient(token).getPrisonerDetails(prisonerNumber)

    const enhancedResult = {
      ...prisoner,
      ...PrisonerSearchService.enhancePrisoner(prisoner),
      friendlyName: convertToTitleCase(`${prisoner.firstName} ${prisoner.lastName}`),
      prisonerNumber: prisoner.offenderNo,
    }

    return enhancedResult
  }
}
