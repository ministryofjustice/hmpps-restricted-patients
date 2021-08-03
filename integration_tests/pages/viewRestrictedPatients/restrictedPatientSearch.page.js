const page = require('../page')

module.exports = {
  verifyOnPage: () =>
    page('Search for a restricted patient', {
      errorSummaryList: () => cy.get('[data-test="error-summary"]'),
      form: () => ({
        searchTerm: () => cy.get('[data-test="patient-search-term-input"]'),
        submit: () => cy.get('[data-test="patient-search-submit"]'),
      }),
    }),
}
