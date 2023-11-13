import Page, { PageElement } from '../page'

export default class MovePrisonerSelectPage extends Page {
  constructor() {
    super('Select a prisoner to move')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="prisoner-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="prisoner-search-submit"]')

  resultsTable = (): PageElement => cy.get('[data-test="prisoner-search-results-table"]')

  noResultsMessage = (): PageElement => cy.get('[data-test="no-results-message"]')

  moveToHospitalLink = (): PageElement => cy.get('[data-test="prisoner-move-to-hospital-link"]')
}
