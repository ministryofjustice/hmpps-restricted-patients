const page = require('../page')

module.exports = {
  verifyOnPage: (prisonerName, hospitalName) =>
    page(`You are moving ${prisonerName} to ${hospitalName}`, {
      form: () => ({
        confirm: () => cy.get('[data-test="confirm-prisoner-move-submit"]'),
        cancel: () => cy.get('[data-test="confirm-prisoner-move-cancel"]'),
      }),
    }),
}
