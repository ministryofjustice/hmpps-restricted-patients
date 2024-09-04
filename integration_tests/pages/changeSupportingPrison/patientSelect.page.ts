import Page, { PageElement } from '../page'

export default class PatientSelectPage extends Page {
  constructor() {
    super('Select a restricted patient to change')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="patient-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="patient-search-submit"]')

  resultsTable = (): PageElement => cy.get('[data-test="patient-search-results-table"]')

  noResultsMessage = (): PageElement => cy.get('[data-test="no-results-message"]')

  changeSupportingPrisonLink = (): PageElement => cy.get('[data-test="change-supporting-prison-link"]')
}
