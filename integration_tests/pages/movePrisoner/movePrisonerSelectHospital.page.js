const page = require('../page')

module.exports = {
  verifyOnPage: name =>
    page(`Move ${name} to a hospital`, {
      errorSummaryList: () => cy.get('[data-test="error-summary"]'),
      prisonerName: () => cy.get('[data-test="prisoner-name"]'),
      prisonerNumber: () => cy.get('[data-test="prisoner-number"]'),
      prisonerCell: () => cy.get('[data-test="prisoner-cell-location"]'),
      prisonerAlerts: () => cy.get('[data-test="prisoner-relevant-alerts"]'),
      form: () => ({
        hospital: () => cy.get('.autocomplete__input'),
        submit: () => cy.get('[data-test="select-hospital-submit"]'),
        cancel: () => cy.get('[data-test="select-hospital-cancel"]'),
      }),
    }),
}
