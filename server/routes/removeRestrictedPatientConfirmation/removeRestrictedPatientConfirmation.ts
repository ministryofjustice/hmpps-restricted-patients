import { Request, Response } from 'express'
import RemoveRestrictedPatientService from '../../services/removeRestrictedPatientService'

export default class RemoveRestrictedPatientConfirmationRoutes {
  constructor(private readonly removeRestrictedPatientService: RemoveRestrictedPatientService) {}

  private renderView = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber } = req.params
    const { user } = res.locals

    const patient = await this.removeRestrictedPatientService.getRestrictedPatient(prisonerNumber, user)

    return res.render('pages/removeRestrictedPatient/removeRestrictedPatientConfirmation', {
      patient,
    })
  }

  view = async (req: Request, res: Response): Promise<void> => this.renderView(req, res)

  submit = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber } = req.params
    const { user } = res.locals

    try {
      await this.removeRestrictedPatientService.removeRestrictedPatient(prisonerNumber, user)
      return res.redirect(`/person-moved/${prisonerNumber}`)
    } catch (error) {
      res.locals.redirectUrl = '/back-to-start'
      throw error
    }
  }
}
