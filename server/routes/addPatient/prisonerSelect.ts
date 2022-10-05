import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import PrisonerSearchService, { PrisonerSearchSummary } from '../../services/prisonerSearchService'
import validateForm from '../searchPrisoners/prisonerSearchValidation'
import RestrictedPatientSearchFilter from '../searchPatients/restrictedPatientSearchFilter'

type PageData = {
  error?: FormError
  searchResults?: PrisonerSearchSummary[]
  searchTerm: string
}
export default class PrisonerSelectRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  private searchFilter = new RestrictedPatientSearchFilter()

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { error, searchResults, searchTerm } = pageData

    return res.render('pages/addPatient/releasedPrisonerSelect', {
      errors: error ? [error] : [],
      journeyStartUrl: `/add-restricted-patient/select-prisoner?searchTerm=${searchTerm}`,
      searchResults,
      searchTerm,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchTerm = JSON.stringify(req.query.searchTerm)?.replace(/"/g, '')

    if (!searchTerm) return res.redirect('/add-restricted-patient/search-for-prisoner')

    const searchResults = await this.prisonerSearchService.search({ searchTerm, prisonIds: ['OUT'] }, user)

    const missingPatients = searchResults.filter(prisoner => this.searchFilter.includePrisonerToAdd(prisoner))

    return this.renderView(req, res, { searchResults: missingPatients, searchTerm })
  }

  submit = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = req.body

    const error = validateForm({ searchTerm })

    if (error) return this.renderView(req, res, { error, searchTerm })

    return res.redirect(`/add-restricted-patient/select-prisoner?${new URLSearchParams({ searchTerm })}`)
  }
}
