const page = require('./page')

const homePage = () =>
  page('Manage restricted patients', {
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
