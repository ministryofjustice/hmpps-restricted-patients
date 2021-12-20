import { Request, Response } from 'express'
import UserService from '../../services/userService'
import { hasAnyRole } from '../../utils/utils'
import config from '../../config'

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
    description: 'Search for a restricted patient to view their details or add a case note.',
    href: '/search-for-restricted-patient',
    roles: ['SEARCH_RESTRICTED_PATIENT'],
    enabled: true,
  },
  {
    id: 'move-to-hospital',
    heading: 'Move someone to a hospital',
    description:
      'Move someone from either a prison or court to a hospital when detained under the Mental Health Act. This also changes them to a restricted patient.',
    href: '/search-for-prisoner',
    roles: ['PRISON_RECEPTION'],
    enabled: true,
  },
  {
    id: 'remove-from-restricted-patients',
    heading: 'Remove someone from restricted patients',
    description: 'Remove someone from restricted patients if they have been released from a hospital to the community.',
    href: '/search-for-a-restricted-patient',
    roles: ['REMOVE_RESTRICTED_PATIENT'],
    enabled: true,
  },
]

export default class HomepageRoutes {
  constructor(private readonly userService: UserService) {}

  view = async (req: Request, res: Response): Promise<void> => {
    const userRoles = await this.userService.getUserRoles(res.locals.user.token)
    const availableTasks = tasks.filter(task => task.enabled).filter(task => hasAnyRole(task.roles, userRoles))

    if (!availableTasks.length)
      return res.render('pages/error', {
        title: 'You do not have permission to view this page',
        url: config.pshUrl,
      })
    return res.render('pages/homepage', {
      tasks: availableTasks,
    })
  }
}
