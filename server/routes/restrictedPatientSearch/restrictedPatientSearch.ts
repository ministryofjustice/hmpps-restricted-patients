import url from 'url'
import { Request, Response } from 'express'
import validateForm from './restrictedPatientSearchValidation'
import { FormError } from '../../@types/template'

export default class RestrictedPatientSearchRoutes {
  constructor(private readonly searchResultsPath: string) {}

  private pages = {
    '/viewing-restricted-patients': 'pages/restrictedPatientSearch',
    '/select-restricted-patient': 'pages/removeRestrictedPatientSearch',
  }

  private renderView = async (req: Request, res: Response, error?: FormError): Promise<void> => {
    return res.render(this.pages[this.searchResultsPath], {
      errors: error ? [error] : [],
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, error)

    return res.redirect(`this.searchResultsPath?${new URLSearchParams({ searchTerm })}`)
  }
}
