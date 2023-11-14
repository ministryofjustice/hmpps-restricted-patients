import Page, { PageElement } from './page'

export default class HomePage extends Page {
  constructor() {
    super('Manage restricted patients')
  }

  headerUserName = (): PageElement => cy.get('[data-qa="header-user-name"]')

  activeLocation = (): PageElement => cy.get('[data-qa="header-active-case-load"]')

  manageAccountLink = (): PageElement => cy.get('[data-test="manage-account-link"]')

  changeLocationLink = (): PageElement => cy.get('[data-qa="changeCaseLoad"]')

  searchRestrictedPatient = (): PageElement => cy.get('[data-test="search-restricted-patient"]')

  moveToHospital = (): PageElement => cy.get('[data-test="move-to-hospital"]')

  addRestrictedPatient = (): PageElement => cy.get('[data-test="add-restricted-patient"]')

  removeFromRestrictedPatients = (): PageElement => cy.get('[data-test="remove-from-restricted-patients"]')

  helpLink = (): PageElement => cy.get('[data-test="help"]')

  signOutLink = (): PageElement => cy.get('[data-qa="signOut"]')

  headerPhaseBanner = (): PageElement => cy.get('.govuk-phase-banner')

  static goTo(): HomePage {
    cy.visit('/')
    return Page.verifyOnPage(HomePage)
  }
}
