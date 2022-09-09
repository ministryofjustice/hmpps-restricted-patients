import { Request, Response } from 'express'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerConfirmationRoutes {
  constructor(
    private readonly movePrisonerService: MovePrisonerService,
    private readonly prisonerSearchService: PrisonerSearchService
  ) {}

  private renderView = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber, hospitalId } = req.params
    const { user } = res.locals

    const [hospital, prisoner] = await Promise.all([
      this.movePrisonerService.getHospital(hospitalId, user),
      this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user),
    ])

    const currentAgencyId = prisoner.assignedLivingUnit?.agencyId

    return res.render('pages/movePrisoner/movePrisonerConfirmation', {
      prisoner,
      currentAgencyId,
      hospital,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber, hospitalId } = req.params
    const { currentAgencyId } = req.body
    const { user } = res.locals

    try {
      await this.movePrisonerService.dischargePatientToHospital(prisonerNumber, currentAgencyId, hospitalId, user)

      return res.redirect(`/move-to-hospital/prisoner-moved-to-hospital/${prisonerNumber}/${hospitalId}`)
    } catch (error) {
      res.locals.redirectUrl = `/back-to-start`
      throw error
    }
  }
}
