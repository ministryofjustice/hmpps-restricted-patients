import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class RemoveRestrictedPatientCompletedRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  view = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber } = req.params
    const { user } = res.locals

    const prisoner = await this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user)

    return res.render('pages/removeRestrictedPatient/removeRestrictedPatientCompleted', {
      prisoner,
    })
  }
}
