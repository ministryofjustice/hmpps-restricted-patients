/* eslint-disable import/no-cycle */
import { Request, Response } from 'express'
import AboutPatientsHelp from './content/aboutPatientsHelp'
import IssuesHelp from './content/issuesHelp'
import RolesHelp from './content/rolesHelp'
import ProductInfoHelp from './content/productInfoHelp'
import AccountsHelp from './content/accountsHelp'
import type { HelpContent } from './index'

export default class HelpRoutes {
  private readonly helpSections: HelpContent[] = [
    new ProductInfoHelp(),
    new AboutPatientsHelp(),
    new IssuesHelp(),
    new AccountsHelp(),
    new RolesHelp(),
  ]

  view = async (req: Request, res: Response): Promise<void> => {
    return res.render('pages/help', {
      helpSections: this.helpSections,
      openSection: req.query.section,
    })
  }
}
