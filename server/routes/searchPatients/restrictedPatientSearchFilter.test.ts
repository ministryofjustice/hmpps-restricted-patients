import RestrictedPatientSearchFilter from './restrictedPatientSearchFilter'
import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

const searchFilter = new RestrictedPatientSearchFilter()

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
const yesterday = addDays(new Date(), -1)
const tomorrow = addDays(new Date(), 1)

describe('restrictedPatientSearchFilter', () => {
  describe('includePrisonerToMove', () => {
    it('should exclude determinate sentences past CRD', () => {
      const prisoner = {
        recall: false,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToMove(prisoner)).toEqual(false)
    })

    it('should include determinate sentences before CRD', () => {
      const prisoner = {
        recall: false,
        indeterminateSentence: false,
        conditionalReleaseDate: tomorrow,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToMove(prisoner)).toEqual(true)
    })

    it('should exclude recalls past SED', () => {
      const prisoner = {
        recall: true,
        sentenceExpiryDate: yesterday,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToMove(prisoner)).toEqual(false)
    })

    it('should include recalls before SED', () => {
      const prisoner = {
        recall: true,
        sentenceExpiryDate: tomorrow,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToMove(prisoner)).toEqual(true)
    })
  })

  describe('includePrisonerToAdd', () => {
    it('should exclude restricted patients', () => {
      const prisoner = {
        restrictedPatient: true,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(false)
    })

    it('should exclude incorrect movements', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'CR',
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(false)
    })

    it('should include detained movements', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'HO',
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(true)
    })

    it('should exclude determinate sentences past CRD', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'HP',
        recall: false,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(false)
    })

    it('should include determinate sentences before CRD', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'HP',
        recall: false,
        indeterminateSentence: false,
        conditionalReleaseDate: tomorrow,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(true)
    })

    it('should exclude recalls past SED', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'HP',
        recall: true,
        sentenceExpiryDate: yesterday,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(false)
    })

    it('should include recalls before SED', () => {
      const prisoner = {
        restrictedPatient: false,
        lastMovementTypeCode: 'REL',
        lastMovementReasonCode: 'HP',
        recall: true,
        sentenceExpiryDate: tomorrow,
        indeterminateSentence: false,
        conditionalReleaseDate: yesterday,
      } as PrisonerSearchSummary

      expect(searchFilter.includePrisonerToAdd(prisoner)).toEqual(true)
    })
  })
})
