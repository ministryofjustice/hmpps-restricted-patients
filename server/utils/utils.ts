import { SelectOption } from '../@types/template'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const addSelect = (selectItems: SelectOption[], text = 'Select'): SelectOption[] => [
  { value: '', text },
  ...selectItems,
]

export const possessive = (string: string): string => {
  if (!string) return ''
  return `${string}${string.toLowerCase().endsWith('s') ? '’' : '’s'}`
}

export const hasAnyRole = (requiredRoles: string[], userRoles: string[]): boolean =>
  !requiredRoles || (!!userRoles && requiredRoles.some(role => userRoles.includes(role)))

export default {
  convertToTitleCase,
  possessive,
  addSelect,
  hasAnyRole,
}
