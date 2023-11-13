import Page, { PageElement } from '../page'

export default class RemoveRestrictedPatientSearchPage extends Page {
  constructor() {
    super('Search for a restricted patient')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="patient-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="patient-search-submit"]')
}
