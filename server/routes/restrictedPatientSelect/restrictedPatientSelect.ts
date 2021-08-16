import url from 'url'
import { Request, Response } from 'express'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'
import validateForm from '../restrictedPatientSearch/restrictedPatientSearchValidation'
import { FormError } from '../../@types/template'

type PageData = {
  error?: FormError
  searchResults?: RestrictedPatientSearchSummary[]
  searchTerm: string
}

export default class RestrictedPatientSelectRoutes {
  constructor(private readonly restrictedPatientSearchService: RestrictedPatientSearchService) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { error, searchResults, searchTerm } = pageData

    return res.render('pages/restrictedPatientSelect', {
      errors: error ? [error] : [],
      searchResults,
      searchTerm,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchTerm = JSON.stringify(req.query.searchTerm)?.replace(/"/g, '')

    if (!searchTerm) return res.redirect('/search-for-a-restricted-patient')

    const searchResults = await this.restrictedPatientSearchService.search({ searchTerm }, user)

    return this.renderView(req, res, { searchResults, searchTerm })
  }

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, { error, searchTerm })

    return res.redirect(
      url.format({
        pathname: '/select-restricted-patient',
        query: { searchTerm },
      })
    )
  }
}
