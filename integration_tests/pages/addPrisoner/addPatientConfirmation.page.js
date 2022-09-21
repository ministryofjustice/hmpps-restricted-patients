const page = require('../page')

module.exports = {
  verifyOnPage: (prisonerName, hospitalName) =>
    page(`You are adding ${prisonerName} to ${hospitalName}`, {
      form: () => ({
        confirm: () => cy.get('[data-test="confirm-prisoner-add-submit"]'),
        cancel: () => cy.get('[data-test="confirm-prisoner-add-cancel"]'),
      }),
    }),
}
