const page = require('../page')

module.exports = {
  verifyOnPage: (prisonerName, hospitalName) =>
    page(`${prisonerName} has been moved to ${hospitalName}`, {
      informationMessage: () => cy.get('[data-test="prisoner-move-completed-help-text"]'),
      finish: () => cy.get('[data-test="prisoner-move-completed-finish"]'),
    }),
}
