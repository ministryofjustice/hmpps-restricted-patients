import { Request, Response } from 'express'
import MovePrisonerService from '../../services/movePrisonerService'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class MovePrisonerCompletedRoutes {
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

    return res.render('pages/movePrisoner/movePrisonerCompleted', {
      prisoner,
      hospital,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)
}
