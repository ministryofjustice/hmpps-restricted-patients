import validateMovePrisoners from './movePrisonerValidation'
import { PrisonerSearchSummary } from '../../services/prisonerSearchService'

describe('validate move prisoners', () => {
  describe('determinate sentence', () => {
    it('should error if released', () => {
      const yesterday = new Date().setDate(new Date().getDate() - 1)
      const result = validateMovePrisoners([
        { indeterminateSentence: false, conditionalReleaseDate: yesterday } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: expect.stringContaining('conditional release date') })])
    })

    it('should not error if not released', () => {
      const tomorrow = new Date().setDate(new Date().getDate() + 1)
      const result = validateMovePrisoners([
        { indeterminateSentence: false, conditionalReleaseDate: tomorrow } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: '' })])
    })

    it('should not error if indeterminate sentence', () => {
      const yesterday = new Date().setDate(new Date().getDate() - 1)
      const result = validateMovePrisoners([
        { indeterminateSentence: true, conditionalReleaseDate: yesterday } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: '' })])
    })
  })

  describe('recall', () => {
    it('should error if sentence expired', () => {
      const yesterday = new Date().setDate(new Date().getDate() - 1)
      const result = validateMovePrisoners([
        { recall: true, sentenceExpiryDate: yesterday } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: expect.stringContaining('sentence expiry date') })])
    })

    it('should not error if not expired', () => {
      const tomorrow = new Date().setDate(new Date().getDate() + 1)
      const result = validateMovePrisoners([
        { recall: true, sentenceExpiryDate: tomorrow } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: '' })])
    })

    it('should not error if not a recall', () => {
      const yesterday = new Date().setDate(new Date().getDate() - 1)
      const result = validateMovePrisoners([
        { recall: false, sentenceExpiryDate: yesterday } as unknown as PrisonerSearchSummary,
      ])

      expect(result).toEqual([expect.objectContaining({ error: '' })])
    })
  })

  describe('remand', () => {
    it('should error if on remand', () => {
      const result = validateMovePrisoners([{ legalStatus: 'REMAND' } as unknown as PrisonerSearchSummary])

      expect(result).toEqual([expect.objectContaining({ error: expect.stringContaining('remand') })])
    })

    it('should not error if not on remand', () => {
      const result = validateMovePrisoners([{ legalStatus: 'SENTENCED' } as unknown as PrisonerSearchSummary])

      expect(result).toEqual([expect.objectContaining({ error: '' })])
    })
  })

  describe('multiple prisoners', () => {
    const yesterday = new Date().setDate(new Date().getDate() - 1)
    const result = validateMovePrisoners([
      { legalStatus: 'REMAND' } as unknown as PrisonerSearchSummary,
      { recall: true, sentenceExpiryDate: yesterday } as unknown as PrisonerSearchSummary,
    ])

    expect(result[0]).toEqual(expect.objectContaining({ error: expect.stringContaining('remand') }))
    expect(result[1]).toEqual(expect.objectContaining({ error: expect.stringContaining('sentence expiry date') }))
  })
})
