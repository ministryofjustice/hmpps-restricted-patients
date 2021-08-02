import { NextFunction, Request, RequestHandler, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

export type ValidationErrorResponse = { field: string; message: string }

const validationMiddleware = (
  type: new () => unknown,
  redirect = (req: Request, res: Response) => res.redirect('back')
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const body = plainToClass(type, req.body, { excludeExtraneousValues: true }) as {}
    const errors: ValidationError[] = await validate(body)
    if (errors.length === 0) {
      return next()
    }

    const addError = (error: ValidationError, constraints: Record<string, string>): ValidationErrorResponse => ({
      field: error.property,
      message: Object.values(constraints).join(),
    })

    const mapErrors = (error: ValidationError) =>
      error.children.length <= 0
        ? addError(error, error.constraints)
        : error.children.map((childError: ValidationError) => addError(error, childError.constraints))

    req.flash('formErrors', JSON.stringify(errors.flatMap(mapErrors)))
    req.flash('formResponse', JSON.stringify(req.body))

    return redirect(req, res)
  }
}

export default validationMiddleware
