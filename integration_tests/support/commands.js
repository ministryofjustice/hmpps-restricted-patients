Cypress.Commands.add('login', () => {
  cy.request(`/manage-restricted-patients`)
  cy.task('getLoginUrl').then(cy.visit)
})
