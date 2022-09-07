const page = require('./page')

const homePage = () =>
  page('Manage restricted patients', {
    loggedInName: () => cy.get('[data-test="logged-in-name"]'),
    activeLocation: () => cy.get('[data-test="active-location"]'),
    manageAccountLink: () => cy.get('[data-test="manage-account-link"]'),
    changeLocationLink: () => cy.get('[data-test="change-location-link"]'),
    searchRestrictedPatient: () => cy.get('[data-test="search-restricted-patient"]'),
    moveToHospital: () => cy.get('[data-test="move-to-hospital"]'),
    migrateIntoHospital: () => cy.get('[data-test="migrate-into-hospital"]'),
    removeFromRestrictedPatients: () => cy.get('[data-test="remove-from-restricted-patients"]'),
    logoutLink: () => cy.get('[data-test="logout-link"]'),
    feedbackBanner: () => cy.get('[data-test="feedback-banner"]'),
  })

export default {
  verifyOnPage: homePage,
  goTo: () => {
    cy.visit(`/`)
    return homePage()
  },
}
