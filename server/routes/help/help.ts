/* eslint-disable import/no-cycle */
import { Request, Response } from 'express'
import AboutPatientsHelp from './content/aboutPatientsHelp'
import IssuesHelp from './content/issuesHelp'
import RolesHelp from './content/rolesHelp'
import ProductInfoHelp from './content/productInfoHelp'
import AccountsHelp from './content/accountsHelp'

export default class HelpRoutes {
  private readonly productInfoHelp = new ProductInfoHelp().helpItems()

  private readonly aboutPatientsHelp = new AboutPatientsHelp().helpItems()

  private readonly rolesHelp = new RolesHelp().helpItems()

  private readonly accountsHelp = new AccountsHelp().helpItems()

  private readonly issuesHelp = new IssuesHelp().helpItems()

  view = async (req: Request, res: Response): Promise<void> => {
    return res.render('pages/help', {
      productInfoHelp: this.productInfoHelp,
      aboutPatientsHelp: this.aboutPatientsHelp,
      rolesHelp: this.rolesHelp,
      accountsHelp: this.accountsHelp,
      issuesHelp: this.issuesHelp,
      openSection: req.query.section,
    })
  }
}
