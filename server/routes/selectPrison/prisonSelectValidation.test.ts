import validateMovePrisonerForm from './prisonSelectValidation'

describe('validateMovePrisonerForm', () => {
  describe('prison', () => {
    it('valid', () => {
      expect(validateMovePrisonerForm({ prison: 'MDI' })).toBeNull()
    })

    it('invalid', () => {
      expect(validateMovePrisonerForm({ prison: '' })).toStrictEqual({
        href: '#prison',
        text: 'Enter a prison',
      })
    })
  })
})
