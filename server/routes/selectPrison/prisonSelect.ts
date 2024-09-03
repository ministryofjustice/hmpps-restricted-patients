import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import validateMovePrisonerForm from './prisonSelectValidation'
import PrisonerSearchService from '../../services/prisonerSearchService'
import { addSelect } from '../../utils/utils'
import AgencySearchService from '../../services/agencySearchService'

type PageData = {
  error?: FormError
}

export default abstract class PrisonSelectRoutes {
  protected constructor(
    private readonly agencySearchService: AgencySearchService,
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly path: string,
    private readonly page: string,
  ) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const { user } = res.locals
    const { error } = pageData

    const [prisons, prisoner] = await Promise.all([
      this.agencySearchService.getPrisons(user),
      this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user),
    ])

    const formattedPrisons = addSelect(
      prisons.map(prison => ({
        value: prison.agencyId,
        text: prison.description,
      })),
      'Select a prison',
    )

    return res.render(this.page, {
      errors: error ? [error] : [],
      prisoner,
      formattedPrisons,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res, {})

  submit = async (req: Request, res: Response): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const { prison } = req.body

    const error = validateMovePrisonerForm({ prison })

    if (error) return this.renderView(req, res, { error })

    this.startNewJourneyInSession(req)

    return res.redirect(`${this.path}?${new URLSearchParams({ prisonerNumber, prisonId: prison })}`)
  }

  protected abstract startNewJourneyInSession(req: Request): void
}
