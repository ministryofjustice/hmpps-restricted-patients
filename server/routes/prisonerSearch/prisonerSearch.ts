import url from 'url'
import { Request, Response } from 'express'
import validateForm from './prisonerSearchValidation'
import { FormError } from '../../@types/template'

export default class PrisonerSearchRoutes {
  private renderView = async (req: Request, res: Response, error?: FormError): Promise<void> => {
    return res.render('pages/prisonerSearch', {
      errors: error ? [error] : [],
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchText } = req.body

    const error = validateForm({ searchText })

    if (error) return this.renderView(req, res, error)

    return res.redirect(
      url.format({
        pathname: '/select-prisoner',
        query: { searchText },
      })
    )
  }
}
