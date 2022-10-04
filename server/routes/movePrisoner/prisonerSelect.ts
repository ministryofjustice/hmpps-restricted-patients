import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'
import validateForm from '../searchPrisoners/prisonerSearchValidation'

type PageData = {
  error?: FormError
  searchResults?: PrisonerSearchSummary[]
  searchTerm: string
}
export default class PrisonerSelectRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { error, searchResults, searchTerm } = pageData

    return res.render('pages/movePrisoner/prisonerSelect', {
      errors: error ? [error] : [],
      journeyStartUrl: `/move-to-hospital/select-prisoner?searchTerm=${searchTerm}`,
      searchResults,
      searchTerm,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchTerm = JSON.stringify(req.query.searchTerm)?.replace(/"/g, '')

    if (!searchTerm) return res.redirect('/move-to-hospital/search-for-prisoner')

    const searchResults = await this.prisonerSearchService.search(
      { searchTerm, prisonIds: [user.activeCaseLoadId] },
      user
    )

    const availablePrisoners = searchResults
      .filter(result => result.indeterminateSentence || result.conditionalReleaseDate > new Date())
      .filter(result => !result.recall || result.sentenceExpiryDate > new Date())

    return this.renderView(req, res, { searchResults: availablePrisoners, searchTerm })
  }

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, { error, searchTerm })

    return res.redirect(`/move-to-hospital/select-prisoner?${new URLSearchParams({ searchTerm })}`)
  }
}
