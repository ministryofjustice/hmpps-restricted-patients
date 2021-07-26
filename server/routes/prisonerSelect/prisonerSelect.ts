import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'

type PageData = {
  error?: FormError
  searchResults?: PrisonerSearchSummary[]
}

export default class PrisonerSelectRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { error, searchResults } = pageData

    return res.render('pages/prisonerSelect', {
      errors: error ? [error] : [],
      searchResults,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchTerm = JSON.stringify(req.query.searchTerm)

    if (!searchTerm) return res.redirect('/search-for-prisoner')

    const searchResults = await this.prisonerSearchService.search(
      { searchTerm, prisonIds: [user.activeCaseLoadId] },
      user
    )

    return this.renderView(req, res, { searchResults })
  }
}
