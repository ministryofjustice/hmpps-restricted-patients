import Page, { PageElement } from '../page'

export default class ViewRestrictedPatientsPage extends Page {
  constructor() {
    super('Restricted patients')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="patient-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="patient-search-submit"]')

  resultsTable = (): PageElement => cy.get('[data-test="patient-search-results-table"]')

  noResultsMessage = (): PageElement => cy.get('[data-test="no-results-message"]')

  viewPrisonerProfile = (): PageElement => cy.get('[data-test="view-prisoner-profile"]')

  addCaseNotes = (): PageElement => cy.get('[data-test="patient-add-case-note-link"]')
}
