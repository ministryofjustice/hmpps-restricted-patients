import { Request, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'

export default class RemoveRestrictedPatientCompletedRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  view = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber } = req.params
    const { user } = res.locals

    if (!req.session.newPrisonerJourney) return res.render('pages/notFound.njk')

    const prisoner = await this.prisonerSearchService.getPrisonerDetails(prisonerNumber, user)

    delete req.session.newPrisonerJourney

    return res.render('pages/removeRestrictedPatient/removeRestrictedPatientCompleted', {
      prisoner,
    })
  }
}
