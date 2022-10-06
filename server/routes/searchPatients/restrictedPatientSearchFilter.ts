import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

export default class RestrictedPatientSearchFilter {
  includePrisonerToMove = (prisoner: PrisonerSearchSummary): boolean => {
    if (this.determinateSentenceAfterCRD(prisoner)) {
      return false
    }
    if (this.recallAfterSED(prisoner)) {
      return false
    }
    return true
  }

  includePrisonerToAdd = (prisoner: PrisonerSearchSummary): boolean => {
    if (prisoner.restrictedPatient) {
      return false
    }
    if (!this.releasedToHospital(prisoner)) {
      return false
    }
    if (this.determinateSentenceAfterCRD(prisoner)) {
      return false
    }
    if (this.recallAfterSED(prisoner)) {
      return false
    }
    return true
  }

  private releasedToHospital = (prisoner: PrisonerSearchSummary): boolean => {
    return prisoner.lastMovementTypeCode === 'REL' && prisoner.lastMovementReasonCode === 'HP'
  }

  private determinateSentenceAfterCRD = (prisoner: PrisonerSearchSummary): boolean => {
    return !prisoner.recall && !prisoner.indeterminateSentence && prisoner.conditionalReleaseDate < new Date()
  }

  private recallAfterSED = (prisoner: PrisonerSearchSummary): boolean => {
    return prisoner.recall && prisoner.sentenceExpiryDate < new Date()
  }
}
