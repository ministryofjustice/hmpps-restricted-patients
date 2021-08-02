import { Request, Response, NextFunction } from 'express'
import { stripDuplicateSlashes } from '../utils/utils'

export default (req: Request, res: Response, next: NextFunction): void => {
  res.internalRedirect = (url: string) => res.redirect(stripDuplicateSlashes(`${req.baseUrl}/${url}`))
  next()
}
