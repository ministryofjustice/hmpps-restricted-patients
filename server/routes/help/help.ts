import { Request, Response } from 'express'
import type { HelpSection } from './index'

export default class HelpRoutes {
  constructor(private readonly aboutHelp: HelpSection[], private readonly issuesHelp: HelpSection[]) {}

  view = async (req: Request, res: Response): Promise<void> => {
    return res.render('pages/help', {
      aboutHelp: this.aboutHelp,
      issuesHelp: this.issuesHelp,
      openSection: req.query.section,
    })
  }
}
