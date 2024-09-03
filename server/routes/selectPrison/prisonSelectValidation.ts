import { FormError } from '../../@types/template'

type MovePrisonerForm = {
  prison?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_PRISON: {
    href: '#prison',
    text: 'Enter a prison',
  },
}

export default function validateMovePrisonerForm({ prison }: MovePrisonerForm): FormError | null {
  if (!prison) {
    return errors.MISSING_PRISON
  }

  return null
}
