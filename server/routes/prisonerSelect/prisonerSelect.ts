import url from 'url'
import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'
import validateForm from '../prisonerSearch/prisonerSearchValidation'
import { alertFlagLabels } from '../../common/alertFlagValues'

type PageData = {
  error?: FormError
  searchResults?: PrisonerSearchSummary[]
  searchTerm: string
}
const join = (left: [], right: []) => left.concat(right)

export default class PrisonerSelectRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { error, searchResults, searchTerm } = pageData

    const searchResultsWithFormattedAlerts = searchResults.map(searchResult => ({
      ...searchResult,
      formattedAlerts: searchResult.alerts
        .map(alert => alertFlagLabels.filter(label => label.alertCodes.includes(alert.alertCode)))
        .reduce(join),
    }))

    return res.render('pages/prisonerSelect', {
      errors: error ? [error] : [],
      journeyStartUrl: `/select-prisoner?searchTerm=${searchTerm}`,
      searchResults: searchResultsWithFormattedAlerts,
      searchTerm,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchTerm = JSON.stringify(req.query.searchTerm)?.replace(/"/g, '')

    if (!searchTerm) return res.redirect('/search-for-prisoner')

    const searchResults = await this.prisonerSearchService.search(
      { searchTerm, prisonIds: [user.activeCaseLoadId] },
      user
    )

    return this.renderView(req, res, { searchResults, searchTerm })
  }

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, { error, searchTerm })

    return res.redirect(
      url.format({
        pathname: '/select-prisoner',
        query: { searchTerm },
      })
    )
  }
}
