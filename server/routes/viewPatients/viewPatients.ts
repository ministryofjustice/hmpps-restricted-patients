import url from 'url'
import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import RestrictedPatientSearchService, {
  RestrictedPatientSearchSummary,
} from '../../services/restrictedPatientSearchService'
import { FormError } from '../../@types/template'
import SearchForm from '../../@types/SearchForm'
import config from '../../config'
import PatientSearchTableViewModel from '../../viewmodel/PatientSearchTableViewModel'

type PageData = {
  error?: FormError
  searchResults?: RestrictedPatientSearchSummary[]
} & SearchForm

export default class ViewPatientsRoutes {
  constructor(private readonly restrictedPatientSearchService: RestrictedPatientSearchService) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const { searchResults, searchTerm } = pageData

    const renderCTA = (prisoner: RestrictedPatientSearchSummary) => ({
      html: `<a href="${config.pshUrl}/prisoner/${prisoner.prisonerNumber}/add-case-note" class="govuk-link" data-test="patient-add-case-note-link">
                <span class="govuk-visually-hidden">${prisoner.displayName} - </span>Add a case note
              </a>`,
    })

    const tableViewModel = new PatientSearchTableViewModel(searchResults).addColumn({ text: '' }, renderCTA)

    return res.render('pages/viewPatients', {
      tableData: tableViewModel.build(),
      searchTerm,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const searchForm = plainToClass(SearchForm, req.query, { excludeExtraneousValues: true })

    const searchResults = await this.restrictedPatientSearchService.search({ searchTerm: searchForm.searchTerm }, user)

    return this.renderView(req, res, { searchResults, ...searchForm })
  }

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
