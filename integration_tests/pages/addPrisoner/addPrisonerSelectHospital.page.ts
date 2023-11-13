import Page, { PageElement } from '../page'

export default class AddPrisonerSelectHospitalPage extends Page {
  constructor(name) {
    super(`Select a hospital for ${name}`)
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  prisonerName = (): PageElement => cy.get('[data-test="prisoner-name"]')

  prisonerNumber = (): PageElement => cy.get('[data-test="prisoner-number"]')

  prisonerLocation = (): PageElement => cy.get('[data-test="prisoner-location"]')

  prisonerAlerts = (): PageElement => cy.get('[data-test="prisoner-relevant-alerts"]')

  hospital = (): PageElement => cy.get('.autocomplete__input')

  submit = (): PageElement => cy.get('[data-test="select-hospital-submit"]')

  cancel = (): PageElement => cy.get('[data-test="select-hospital-cancel"]')
}
