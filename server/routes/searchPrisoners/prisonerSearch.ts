import { Request, Response } from 'express'
import validateForm from './prisonerSearchValidation'
import { FormError } from '../../@types/template'

export default class PrisonerSearchRoutes {
  constructor(private readonly searchResultsPath: string) {}

  private pages = {
    '/move-to-hospital/select-prisoner': 'pages/prisonerSearch',
    '/add-restricted-patient/select-prisoner': 'pages/releasedPrisonerSearch',
  }

  private renderView = async (req: Request, res: Response, error?: FormError): Promise<void> =>
    res.render(this.pages[this.searchResultsPath], {
      errors: error ? [error] : [],
    })

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, error)

    return res.redirect(`${this.searchResultsPath}?${new URLSearchParams({ searchTerm })}`)
  }
}
