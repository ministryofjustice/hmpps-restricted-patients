const homepage = require('../../pages/homepage')

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubAuthUser')
  })

  describe('Header', () => {
    it('should display the correct details for the logged in user', () => {
      cy.task('stubLogin')
      cy.login()
      const page = homepage.goTo()

      page.loggedInName().contains('J. Smith')
      page.activeLocation().contains('Moorland')

      page
        .manageAccountLink()
        .should('have.attr', 'href')
        .then(href => {
          expect(href).to.equal('http://localhost:9091/auth/account-details')
        })

      page.changeLocationLink().should('not.exist')
    })

    it('should show change location link when user has more than 1 caseload', () => {
      cy.task('stubLogin', [
        {
          caseLoadId: 'MDI',
          description: 'Moorland',
          currentlyActive: true,
        },
        {
          caseLoadId: 'LEI',
          description: 'Leeds',
          currentlyActive: false,
        },
      ])
      cy.login()

      const page = homepage.goTo()

      page
        .changeLocationLink()
        .should('be.visible')
        .should('have.attr', 'href')
        .then(href => {
          expect(href).to.equal('http://localhost:3002/change-caseload')
        })
    })
  })

  describe('Tasks', () => {
    beforeEach(() => {
      cy.task('stubLogin')
      cy.login()
    })
    it('should show search restricted patient', () => {
      const page = homepage.goTo()

      page.searchRestrictedPatient().should('exist')
    })
    it('should show move to hospital', () => {
      const page = homepage.goTo()

      page.moveToHospital().should('exist')
    })
    it('should show remove from restricted patients', () => {
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
    })
  })
})
