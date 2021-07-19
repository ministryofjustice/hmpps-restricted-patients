import validateForm from './prisonerSearchValidation'

describe('validateForm', () => {
  describe('searchText', () => {
    it('valid', () => {
      expect(validateForm({ searchText: 'Smith' })).toBeNull()
    })

    it('invalid', () => {
      expect(validateForm({ searchText: '' })).toStrictEqual({
        href: '#searchText',
        text: 'Enter a prisoner’s name or number',
      })
    })
  })
})
