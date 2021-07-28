import { FormError } from '../../@types/template'

type SearchForm = {
  searchTerm?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_TEXT: {
    href: '#searchTerm',
    text: 'Enter a restricted patient’s name or prison number',
  },
}

export default function validateForm({ searchTerm }: SearchForm): FormError | null {
  if (!searchTerm) {
    return errors.MISSING_TEXT
  }

  return null
}
