import { FormError } from '../../@types/template'

type MovePrisonerForm = {
  hospital?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_HOSPITAL: {
    href: '#hospital',
    text: 'Select a hospital',
  },
}

export default function validateMovePrisonerForm({ hospital }: MovePrisonerForm): FormError | null {
  if (!hospital) {
    return errors.MISSING_HOSPITAL
  }

  return null
}
