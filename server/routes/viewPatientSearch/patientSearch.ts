import url from 'url'
import { Request, Response } from 'express'
import validateForm from './patientSearchValidation'
import { FormError } from '../../@types/template'

export default class PatientSearchRoutes {
  constructor(private readonly searchResultsPath: string) {}

  private renderView = async (req: Request, res: Response, error?: FormError): Promise<void> => {
    return res.render('pages/patientSearch', {
      errors: error ? [error] : [],
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, error)

    return res.redirect(
      url.format({
        pathname: this.searchResultsPath,
        query: { searchTerm },
      })
    )
  }
}
