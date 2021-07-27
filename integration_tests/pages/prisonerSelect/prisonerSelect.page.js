const page = require('../page')

module.exports = {
  verifyOnPage: () =>
    page('Select a prisoner', {
      errorSummaryList: () => cy.get('[data-test="error-summary"]'),
      form: () => ({
        searchTerm: () => cy.get('[data-test="prisoner-search-term-input"]'),
        submit: () => cy.get('[data-test="prisoner-search-submit"]'),
      }),
      resultsTable: () => cy.get('[data-test="prisoner-search-results-table"]'),
      noResultsMessage: () => cy.get('[data-test="no-results-message"]'),
    }),
}
