import Page, { PageElement } from '../page'

export default class MovePrisonerSearchPage extends Page {
  constructor() {
    super('Search for a prisoner to move')
  }

  errorSummaryList = (): PageElement => cy.get('[data-test="error-summary"]')

  searchTerm = (): PageElement => cy.get('[data-test="prisoner-search-term-input"]')

  submit = (): PageElement => cy.get('[data-test="prisoner-search-submit"]')
}
