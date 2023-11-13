import Page, { PageElement } from '../page'

export default class MovePrisonerSelectHospitalPage extends Page {
  constructor(name: string) {
    super(`Move ${name} to a hospital`)
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  prisonerName = (): PageElement => cy.get('[data-test="prisoner-name"]')

  prisonerNumber = (): PageElement => cy.get('[data-test="prisoner-number"]')

  prisonerCell = (): PageElement => cy.get('[data-test="prisoner-cell-location"]')

  prisonerAlerts = (): PageElement => cy.get('[data-test="prisoner-relevant-alerts"]')

  hospital = (): PageElement => cy.get('.autocomplete__input')

  submit = (): PageElement => cy.get('[data-test="select-hospital-submit"]')

  cancel = (): PageElement => cy.get('[data-test="select-hospital-cancel"]')
}
