const homepage = require('../../pages/homepage')

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.login()
  })

  describe('Tasks', () => {
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
