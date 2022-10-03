import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

export interface ValidatedPrisonerSearchSummary extends PrisonerSearchSummary {
  error: string
}

export default function validateMovePrisoners(
  searchSummaries: PrisonerSearchSummary[]
): ValidatedPrisonerSearchSummary[] {
  return searchSummaries.map(searchSummary => {
    const validated: ValidatedPrisonerSearchSummary = { ...searchSummary, error: '' }
    if (!searchSummary.indeterminateSentence && searchSummary.conditionalReleaseDate < new Date()) {
      validated.error = 'The prisoner has conditional release date is in the past'
    } else if (searchSummary.recall && searchSummary.sentenceExpiryDate < new Date()) {
      validated.error = 'The prisoner has been recalled and the sentence expiry date is in the past'
    } else if (searchSummary.legalStatus === 'REMAND') {
      validated.error = 'The prisoner is on remand'
    }
    return validated
  })
}
