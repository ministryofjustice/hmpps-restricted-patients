const page = require('../page')

module.exports = {
  verifyOnPage: prisonerName =>
    page(`You are removing ${prisonerName} from restricted patients`, {
      patientName: () => cy.get('[data-test="patient-name"]'),
      prisonerNumber: () => cy.get('[data-test="prisoner-number"]'),
      patientHospital: () => cy.get('[data-test="patient-hospital"]'),
      confirmRemoval: () => cy.get('[data-test="confirm-patient-removal-submit"]'),
    }),
}
