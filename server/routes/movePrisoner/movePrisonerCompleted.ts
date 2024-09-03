import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'
import AgencySearchService from '../../services/agencySearchService'

export default class MovePrisonerCompletedRoutes {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly agencySearchService: AgencySearchService,
  ) {}

  private renderView = async (req: Request, res: Response): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const hospitalId = req.query.hospitalId as string
    const { user } = res.locals

    const [hospital, prisoner] = await Promise.all([
      this.agencySearchService.getAgency(hospitalId, user),
      this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user),
    ])

    return res.render('pages/movePrisoner/movePrisonerCompleted', {
      prisoner,
      hospital,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => {
    if (!req.session.newMovePrisonerJourney) return res.render('pages/notFound.njk')
    delete req.session.newMovePrisonerJourney
    return this.renderView(req, res)
  }
}
