Cypress.Commands.add('signIn', () => {
  cy.request(`/`)
  cy.task('getSignInUrl').then(cy.visit)
})
