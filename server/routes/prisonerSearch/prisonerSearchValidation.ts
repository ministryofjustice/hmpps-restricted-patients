import { FormError } from '../../@types/template'

type SearchForm = {
  searchText?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_TEXT: {
    href: '#searchText',
    text: 'Enter a prisoner’s name or number',
  },
}

export default function validateForm({ searchText }: SearchForm): FormError | null {
  if (!searchText) {
    return errors.MISSING_TEXT
  }

  return null
}
