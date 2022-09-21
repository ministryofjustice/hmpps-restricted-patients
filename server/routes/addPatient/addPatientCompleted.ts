import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'
import HospitalSearchService from '../../services/hospitalSearchService'

export default class AddPatientCompletedRoutes {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly hospitalSearchService: HospitalSearchService
  ) {}

  private renderView = async (req: Request, res: Response): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const hospitalId = req.query.hospitalId as string
    const { user } = res.locals

    const [hospital, prisoner] = await Promise.all([
      this.hospitalSearchService.getHospital(hospitalId, user),
      this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user),
    ])

    return res.render('pages/addPatient/addPatientCompleted', {
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
