import { Request, Response } from 'express'

type TaskType = {
  id: string
  heading: string
  href: string
  description: string
  roles: Array<string> | null
  enabled: (args: { roles: string[] }) => boolean
}

const isEnabled = (): boolean => true

export const tasks: TaskType[] = [
  {
    id: 'Search-restricted-patient',
    heading: 'Search for a restricted patient',
    description: 'Search for a restricted patient to view their details and to add a case note.',
    href: '/search-for-a-restricted-patient',
    roles: null,
    enabled: isEnabled,
  },
  {
    id: 'Move-to-hospital',
    heading: 'Move someone to a hospital',
    description:
      'Move someone from either a prison or court to a hospital when detained under the Mental Health Act. This also changes them to a restricted patient.',
    href: '/search-for-prisoner',
    roles: null,
    enabled: isEnabled,
  },
  {
    id: 'Remove-from-restricted-patients',
    heading: 'Remove someone from restricted patients',
    description: 'Remove someone from restricted patients if they have been released from a hospital to the community.',
    href: '/search-for-a-restricted-patient',
    roles: null,
    enabled: isEnabled,
  },
]

export default () =>
  (_req: Request, res: any): Response => {
    return res.render('pages/index', {
      tasks,
    })
  }
