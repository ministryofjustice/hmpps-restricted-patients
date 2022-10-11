import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

export default class RestrictedPatientSearchFilter {
  includePrisonerToMove = (prisoner: PrisonerSearchSummary): boolean =>
    !this.determinateSentenceAfterCRD(prisoner) && !this.recallAfterSED(prisoner)

  includePrisonerToAdd = (prisoner: PrisonerSearchSummary): boolean =>
    !prisoner.restrictedPatient &&
    this.releasedToHospital(prisoner) &&
    !this.determinateSentenceAfterCRD(prisoner) &&
    !this.recallAfterSED(prisoner)

  private releasedToHospital = (prisoner: PrisonerSearchSummary): boolean =>
    prisoner.lastMovementTypeCode === 'REL' &&
    (prisoner.lastMovementReasonCode === 'HP' || prisoner.lastMovementReasonCode === 'HO')

  private determinateSentenceAfterCRD = (prisoner: PrisonerSearchSummary): boolean =>
    !prisoner.recall && !prisoner.indeterminateSentence && prisoner.conditionalReleaseDate < new Date()

  private recallAfterSED = (prisoner: PrisonerSearchSummary): boolean =>
    prisoner.recall && prisoner.sentenceExpiryDate < new Date()
}
