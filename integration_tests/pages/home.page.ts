import Page, { PageElement } from './page'

export default class HomePage extends Page {
  constructor() {
    super('Manage restricted patients')
  }

  searchRestrictedPatient = (): PageElement => cy.get('[data-test="search-restricted-patient"]')

  moveToHospital = (): PageElement => cy.get('[data-test="move-to-hospital"]')

  addRestrictedPatient = (): PageElement => cy.get('[data-test="add-restricted-patient"]')

  removeFromRestrictedPatients = (): PageElement => cy.get('[data-test="remove-from-restricted-patients"]')

  changeSupportingPrison = (): PageElement => cy.get('[data-test="change-supporting-prison"]')

  helpLink = (): PageElement => cy.get('[data-test="help"]')

  static goTo(): HomePage {
    cy.visit('/')
    return Page.verifyOnPage(HomePage)
  }
}
