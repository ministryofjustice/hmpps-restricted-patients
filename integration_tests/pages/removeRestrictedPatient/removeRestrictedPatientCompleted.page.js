const page = require('../page')

module.exports = {
  verifyOnPage: prisonerName =>
    page(`${prisonerName} has been removed from restricted patients`, {
      finishButton: () => cy.get('[data-test="restricted-patient-removal-completed-finish"]'),
    }),
}
