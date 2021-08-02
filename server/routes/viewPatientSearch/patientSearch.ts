import url from 'url'
import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { FormError } from '../../@types/template'
import SearchForm from '../../@types/SearchForm'

export default class PatientSearchRoutes {
  private renderView = async (req: Request, res: Response, error?: FormError): Promise<void> => {
    return res.render('pages/patientSearch')
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = plainToClass(SearchForm, req.body, { excludeExtraneousValues: true })
    return res.redirect(
      url.format({
        pathname: '/viewing-restricted-patients',
        query: { searchTerm },
      })
    )
  }
}
