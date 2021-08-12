import validateForm from './restrictedPatientSearchValidation'

describe('validateForm', () => {
  describe('searchTerm', () => {
    it('valid', () => {
      expect(validateForm({ searchTerm: 'Smith' })).toBeNull()
    })

    it('invalid', () => {
      expect(validateForm({ searchTerm: '' })).toStrictEqual({
        href: '#searchTerm',
        text: 'Enter a restricted patient’s name or prison number',
      })
    })
  })
})
