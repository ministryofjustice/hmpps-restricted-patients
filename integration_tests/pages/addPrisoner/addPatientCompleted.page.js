const page = require('../page')

module.exports = {
  verifyOnPage: (prisonerName, hospitalName) =>
    page(`${prisonerName} has been added to ${hospitalName}`, {
      informationMessage: () => cy.get('[data-test="prisoner-add-completed-help-text"]'),
      finish: () => cy.get('[data-test="prisoner-add-completed-finish"]'),
    }),
}
