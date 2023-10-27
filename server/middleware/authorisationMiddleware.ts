import { jwtDecode } from 'jwt-decode'
import { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

export default function authorisationMiddleware(
  renderNotFound: boolean,
  authorisedRoles: string[] = [],
): RequestHandler {
  // authorities in the user token will always be prefixed by ROLE_.
  // Convert roles that are passed into this function without the prefix so that we match correctly.
  const authorisedAuthorities = authorisedRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
  return asyncMiddleware((req, res, next) => {
    if (res.locals && res.locals.user && res.locals.user.token) {
      const { authorities = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }

      if (authorisedAuthorities.length && !authorities.some(authority => authorisedAuthorities.includes(authority))) {
        logger.error('User is not authorised to access this')
        return renderNotFound ? res.render('pages/notFound.njk') : res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  })
}
