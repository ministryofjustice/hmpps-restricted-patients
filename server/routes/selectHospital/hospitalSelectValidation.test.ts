import validateMovePrisonerForm from './hospitalSelectValidation'

describe('validateMovePrisonerForm', () => {
  describe('hospital', () => {
    it('valid', () => {
      expect(validateMovePrisonerForm({ hospital: 'SHEFF' })).toBeNull()
    })

    it('invalid', () => {
      expect(validateMovePrisonerForm({ hospital: '' })).toStrictEqual({
        href: '#hospital',
        text: 'Enter a hospital',
      })
    })
  })
})
