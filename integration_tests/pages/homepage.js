const page = require('./page')

const homePage = () =>
  page('Manage restricted patients', {
    loggedInName: () => cy.get('[data-qa="header-user-name"]'),
    activeLocation: () => cy.get('[data-qa="header-active-case-load"]'),
    manageAccountLink: () => cy.get('[data-test="manage-account-link"]'),
    changeLocationLink: () => cy.get('[data-qa="changeCaseLoad"]'),
    searchRestrictedPatient: () => cy.get('[data-test="search-restricted-patient"]'),
    moveToHospital: () => cy.get('[data-test="move-to-hospital"]'),
    addRestrictedPatient: () => cy.get('[data-test="add-restricted-patient"]'),
    removeFromRestrictedPatients: () => cy.get('[data-test="remove-from-restricted-patients"]'),
    helpLink: () => cy.get('[data-test="help"]'),
    signOutLink: () => cy.get('[data-qa="signOut"]'),
    feedbackBanner: () => cy.get('[data-test="feedback-banner"]'),
  })

export default {
  verifyOnPage: homePage,
  goTo: () => {
    cy.visit(`/`)
    return homePage()
  },
}
