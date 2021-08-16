const page = require('../page')

module.exports = {
  verifyOnPage: () =>
    page('Select a restricted patient', {
      errorSummaryList: () => cy.get('[data-test="error-summary"]'),
      form: () => ({
        searchTerm: () => cy.get('[data-test="patient-search-term-input"]'),
        submit: () => cy.get('[data-test="patient-search-submit"]'),
      }),
      resultsTable: () => cy.get('[data-test="patient-search-results-table"]'),
      noResultsMessage: () => cy.get('[data-test="no-results-message"]'),
      viewPrisonerProfile: () => cy.get('[data-test="view-prisoner-profile"]'),
      removeRestrictedPatientLink: () => cy.get('[data-test="remove-restricted-patient-link"]'),
    }),
}
