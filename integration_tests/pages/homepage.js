const page = require('./page')

const homePage = () =>
  page('Manage restricted patients', {
    loggedInName: () => cy.get('[data-test="logged-in-name"]'),
    activeLocation: () => cy.get('[data-test="active-location"]'),
    manageAccountLink: () => cy.get('[data-test="manage-account-link"]'),
    changeLocationLink: () => cy.get('[data-test="change-location-link"]'),
    headerUserName: () => cy.get('[data-qa=header-user-name]'),
    searchRestrictedPatient: () => cy.get('[data-test="search-restricted-patient"]'),
    moveToHospital: () => cy.get('[data-test="move-to-hospital"]'),
    removeFromRestrictedPatients: () => cy.get('[data-test="remove-from-restricted-patients"]'),
  })

export default {
  verifyOnPage: homePage,
  goTo: () => {
    cy.visit(`/`)
    return homePage()
  },
}
