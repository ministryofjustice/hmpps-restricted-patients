import { NextFunction, Request, Response } from 'express'

const flashMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const validationErrorsMessage = req.flash('formErrors') || []
  const validationErrors = validationErrorsMessage[0] || null

  const formResponsesMessage = req.flash('formResponse') || []
  const formResponse = formResponsesMessage[0] || null

  if (validationErrors) {
    res.locals.validationErrors = JSON.parse(validationErrors)
    res.locals.formResponse = JSON.parse(formResponse)
  }

  return next()
}

export default flashMiddleware
