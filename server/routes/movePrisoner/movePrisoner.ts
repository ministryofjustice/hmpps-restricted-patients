import { Request, Response } from 'express'
import { FormError } from '../../@types/template'
import validateMovePrisonerForm from './movePrisonerValidation'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import { addSelect } from '../../utils/utils'

type PageData = {
  error?: FormError
}

export default class PrisonerSelectRoutes {
  constructor(
    private readonly movePrisonerService: MovePrisonerService,
    private readonly prisonerSearchService: PrisonerSearchService
  ) {}

  private renderView = async (req: Request, res: Response, pageData: PageData): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const { user } = res.locals
    const { error } = pageData

    const [hospitals, prisoner] = await Promise.all([
      this.movePrisonerService.getHospitals(user),
      this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user),
    ])

    const formattedHospitals = addSelect(
      hospitals.map(hospital => ({
        value: hospital.agencyId,
        text: hospital.description,
      })),
      'Select a hospital'
    )

    return res.render('pages/movePrisoner/movePrisonerSelectHospital', {
      errors: error ? [error] : [],
      prisoner,
      formattedHospitals,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res, {})

  submit = async (req: Request, res: Response): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const { hospital } = req.body

    const error = validateMovePrisonerForm({ hospital })

    if (error) return this.renderView(req, res, { error })

    req.session.newMovePrisonerJourney = true

    return res.redirect(
      `/move-to-hospital/confirm-move?${new URLSearchParams({ prisonerNumber, hospitalId: hospital })}`
    )
  }
}
