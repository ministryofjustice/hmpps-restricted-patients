import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { URLSearchParams } from 'url'
import SearchForm from '../../@types/SearchForm'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'
import PatientSearchTableViewModel from '../../viewmodel/PatientSearchTableViewModel'
import { RemoveRestrictedPatientPath } from './constants'

export default class RemoveRestrictedPatientRoutes {
  constructor(private readonly restrictedPatientSearchService: RestrictedPatientSearchService) {}

  displaySearch = (req: Request, res: Response): void => {
    res.render('pages/patientSearch', {
      action: RemoveRestrictedPatientPath.SearchResults,
    })
  }

  searchFormRedirect = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = plainToClass(SearchForm, req.body, { excludeExtraneousValues: true })
    res.internalRedirect(`?${new URLSearchParams({ searchTerm })}`)
  }

  displaySearchResults = async (req: Request, res: Response): Promise<void> => {
    const { searchTerm } = plainToClass(SearchForm, req.query, { excludeExtraneousValues: true })
    if (!searchTerm) {
      res.internalRedirect(RemoveRestrictedPatientPath.DisplaySearch)
      return
    }

    const { user } = res.locals
    const searchResults = await this.restrictedPatientSearchService.search({ searchTerm }, user)

    const renderCTA = (prisoner: RestrictedPatientSearchSummary) => ({
      html: `<a href="/person-removed/${prisoner.prisonerNumber}" class="govuk-link" data-test="remove-restricted-patient-link">
                <span class="govuk-visually-hidden">${prisoner.displayName} - </span>Remove as a restricted patient
              </a>`,
    })

    const tableViewModel = new PatientSearchTableViewModel(searchResults).addColumn({ text: '' }, renderCTA)

    const heading = 'Select a restricted patient'

    res.render('pages/viewPatients', {
      tableData: tableViewModel.build(),
      heading,
      pageTitle: heading,
      searchTerm,
    })
  }
}
