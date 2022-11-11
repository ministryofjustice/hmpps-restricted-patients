import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

// eslint-disable-next-line no-shadow
export enum SearchStatus {
  INCLUDE = 'include',
  EXCLUDE_POST_CRD = 'exclude-post-crd',
  EXCLUDE_POST_SED = 'exclude-post-sed',
  EXCLUDE = 'exclude',
}

export default class RestrictedPatientSearchFilter {
  includePrisonerToMove = (prisoner: PrisonerSearchSummary): SearchStatus => {
    if (this.determinateSentenceAfterCRD(prisoner)) {
      return SearchStatus.EXCLUDE_POST_CRD
    }
    if (this.recallAfterSED(prisoner)) {
      return SearchStatus.EXCLUDE_POST_SED
    }
    return SearchStatus.INCLUDE
  }

  includePrisonerToAdd = (prisoner: PrisonerSearchSummary): SearchStatus => {
    if (prisoner.restrictedPatient || !this.releasedToHospital(prisoner)) {
      return SearchStatus.EXCLUDE
    }
    if (this.determinateSentenceAfterCRD(prisoner)) {
      return SearchStatus.EXCLUDE_POST_CRD
    }
    if (this.recallAfterSED(prisoner)) {
      return SearchStatus.EXCLUDE_POST_SED
    }
    return SearchStatus.INCLUDE
  }

  private releasedToHospital = (prisoner: PrisonerSearchSummary): boolean =>
    prisoner.lastMovementTypeCode === 'REL' &&
    (prisoner.lastMovementReasonCode === 'HP' || prisoner.lastMovementReasonCode === 'HO')

  private determinateSentenceAfterCRD = (prisoner: PrisonerSearchSummary): boolean =>
    !prisoner.recall && !prisoner.indeterminateSentence && prisoner.conditionalReleaseDate < new Date()

  private recallAfterSED = (prisoner: PrisonerSearchSummary): boolean =>
    prisoner.recall && prisoner.sentenceExpiryDate < new Date()
}
