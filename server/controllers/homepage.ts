import { Request, Response } from 'express'

type TaskType = {
  id: string
  heading: string
  href: string
  description: string
  roles: Array<string> | null
  enabled: boolean
}

export const tasks: TaskType[] = [
  {
    id: 'search-restricted-patient',
    heading: 'Search for a restricted patient',
    description: 'Search for a restricted patient to view their details and to add a case note.',
    href: '/search-for-a-restricted-patient',
    roles: null,
    enabled: true,
  },
  {
    id: 'move-to-hospital',
    heading: 'Move someone to a hospital',
    description:
      'Move someone from either a prison or court to a hospital when detained under the Mental Health Act. This also changes them to a restricted patient.',
    href: '/search-for-prisoner',
    roles: null,
    enabled: true,
  },
  {
    id: 'remove-from-restricted-patients',
    heading: 'Remove someone from restricted patients',
    description: 'Remove someone from restricted patients if they have been released from a hospital to the community.',
    href: '/search-for-a-restricted-patient',
    roles: null,
    enabled: true,
  },
]

export default (_req: Request, res: Response): void => {
  return res.render('pages/homepage', {
    tasks,
  })
}
