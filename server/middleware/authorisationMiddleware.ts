import jwtDecode from 'jwt-decode'
import { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

export default function authorisationMiddleware(
  renderNotFound: boolean,
  authorisedRoles: string[] = []
): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    if (res.locals && res.locals.user && res.locals.user.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedRoles.length && !roles.some(role => authorisedRoles.includes(role))) {
        logger.error('User is not authorised to access this')
        return renderNotFound ? res.render('pages/notFound.njk') : res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/login')
  })
}
