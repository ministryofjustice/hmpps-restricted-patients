import { convertToTitleCase, possessive, hasAnyRole } from './utils'

describe('Convert to title case', () => {
  it('null string', () => {
    expect(convertToTitleCase(null)).toEqual('')
  })
  it('empty string', () => {
    expect(convertToTitleCase('')).toEqual('')
  })
  it('Lower Case', () => {
    expect(convertToTitleCase('robert')).toEqual('Robert')
  })
  it('Upper Case', () => {
    expect(convertToTitleCase('ROBERT')).toEqual('Robert')
  })
  it('Mixed Case', () => {
    expect(convertToTitleCase('RoBErT')).toEqual('Robert')
  })
  it('Multiple words', () => {
    expect(convertToTitleCase('RobeRT SMiTH')).toEqual('Robert Smith')
  })
  it('Leading spaces', () => {
    expect(convertToTitleCase('  RobeRT')).toEqual('  Robert')
  })
  it('Trailing spaces', () => {
    expect(convertToTitleCase('RobeRT  ')).toEqual('Robert  ')
  })
  it('Hyphenated', () => {
    expect(convertToTitleCase('Robert-John SmiTH-jONes-WILSON')).toEqual('Robert-John Smith-Jones-Wilson')
  })
})

describe('Possessive', () => {
  it('No string', () => {
    expect(possessive(null)).toEqual('')
  })
  it('Converts name with no S correctly', () => {
    expect(possessive('David Smith')).toEqual('David Smith’s')
  })
  it('Converts name with S correctly', () => {
    expect(possessive('David Jones')).toEqual('David Jones’')
  })
})

describe('hasAnyRole', () => {
  it('returns true when they have one of the required roles', () => {
    expect(hasAnyRole(['ROLE_ONE', 'ROLE_TWO'], ['ROLE_ONE'])).toEqual(true)
  })
  it('returns false when they have none of the required roles', () => {
    expect(hasAnyRole(['ROLE_ONE', 'ROLE_TWO'], ['ROLE_THREE', 'ROLE_FOUR'])).toEqual(false)
    expect(hasAnyRole(['ROLE_ONE', 'ROLE_TWO'], null)).toEqual(false)
  })
  it('returns true if there are no required roles', () => {
    expect(hasAnyRole(null, null)).toEqual(true)
    expect(hasAnyRole(null, ['ROLE_ONE'])).toEqual(true)
  })
})
