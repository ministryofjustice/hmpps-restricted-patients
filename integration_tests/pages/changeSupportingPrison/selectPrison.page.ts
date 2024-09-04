import Page, { PageElement } from '../page'

export default class SelectPrisonPage extends Page {
  constructor(name) {
    super(`Select a supporting prison for ${name}`)
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  prisonerName = (): PageElement => cy.get('[data-test="prisoner-name"]')

  prisonerNumber = (): PageElement => cy.get('[data-test="prisoner-number"]')

  prisonerLocation = (): PageElement => cy.get('[data-test="prisoner-location"]')

  prisonerSupportingPrison = (): PageElement => cy.get('[data-test="prisoner-supporting-prison"]')

  prison = (): PageElement => cy.get('.autocomplete__input')

  submit = (): PageElement => cy.get('[data-test="select-prison-submit"]')

  cancel = (): PageElement => cy.get('[data-test="select-prison-cancel"]')
}
