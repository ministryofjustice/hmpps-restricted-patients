import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'
import HospitalSearchService from '../../services/hospitalSearchService'
import MigratePrisonerService from '../../services/migratePrisonerService'

export default class AddPatientConfirmationRoutes {
  constructor(
    private readonly migratePrisonerService: MigratePrisonerService,
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

    return res.render('pages/addPatient/addPatientConfirmation', {
      prisoner,
      hospital,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const prisonerNumber = req.query.prisonerNumber as string
    const hospitalId = req.query.hospitalId as string
    const { user } = res.locals

    try {
      await this.migratePrisonerService.migrateToHospital(prisonerNumber, hospitalId, user)

      return res.redirect(
        `/add-restricted-patient/prisoner-added?${new URLSearchParams({ prisonerNumber, hospitalId })}`
      )
    } catch (error) {
      res.locals.redirectUrl = `/back-to-start`
      throw error
    }
  }
}
