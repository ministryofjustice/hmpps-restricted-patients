import Page, { PageElement } from '../page'

export default class AddPrisonerSelectPage extends Page {
  constructor() {
    super('Select a prisoner to add')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="prisoner-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="prisoner-search-submit"]')

  resultsTable = (): PageElement => cy.get('[data-test="prisoner-search-results-table"]')

  noResultsMessage = (): PageElement => cy.get('[data-test="no-results-message"]')

  addRestrictedPatientLink = (): PageElement => cy.get('[data-test="prisoner-add-restricted-patient-link"]')
}
