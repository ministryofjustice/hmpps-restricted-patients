const page = require('../page')

module.exports = {
  verifyOnPage: () => page('Search for a prisoner', {}),
  errorSummaryList: () => cy.get('[data-test="error-summary"]'),
  form: () => ({
    searchText: () => cy.get('[data-test="prisoner-search-text-input"]'),
    submit: () => cy.get('[data-test="prisoner-search-submit"]'),
  }),
}
