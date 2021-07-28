import validateForm from './patientSearchValidation'

describe('validateForm', () => {
  describe('searchTerm', () => {
    it('valid', () => {
      expect(validateForm({ searchTerm: 'Smith' })).toBeNull()
    })

    it('invalid', () => {
      expect(validateForm({ searchTerm: '' })).toStrictEqual({
        href: '#searchTerm',
        text: 'Enter a patient’s name or prison number',
      })
    })
  })
})
