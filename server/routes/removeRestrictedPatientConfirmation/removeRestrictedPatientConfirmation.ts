import { Request, Response } from 'express'
import RemoveRestrictedPatientService from '../../services/removeRestrictedPatientService'

export default class RemoveRestrictedPatientConfirmationRoutes {
  constructor(
    private readonly removeRestrictedPatientService: RemoveRestrictedPatientService,
    private readonly raiseAnalyticsEvent: (cat: string, action: string, label: string) => void
  ) {}

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

    req.session.newRemoveRestrictedPatientJourney = true

    try {
      const patient = await this.removeRestrictedPatientService.getRestrictedPatient(prisonerNumber, user)
      await this.removeRestrictedPatientService.removeRestrictedPatient(prisonerNumber, user)

      this.raiseAnalyticsEvent(
        'Restricted Patients',
        `Restricted patient removed`,
        `Restricted patient removed from ${patient.hospital}`
      )

      return res.redirect(`/person-removed/${prisonerNumber}`)
    } catch (error) {
      res.locals.redirectUrl = '/back-to-start'
      throw error
    }
  }
}
