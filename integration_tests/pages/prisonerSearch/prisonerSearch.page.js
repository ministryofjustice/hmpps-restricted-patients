const page = require('../page')

module.exports = {
  verifyOnPage: () => page('Search for a prisoner', {}),
  errorSummaryList: () => cy.get('[data-test="error-summary"]'),
  form: () => ({
    searchTerm: () => cy.get('[data-test="prisoner-search-term-input"]'),
    submit: () => cy.get('[data-test="prisoner-search-submit"]'),
  }),
}
