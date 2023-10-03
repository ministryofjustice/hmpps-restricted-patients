const homepage = require('../../pages/homepage')

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubFrontendComponents')
    cy.task('stubUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'TRANSFER_RESTRICTED_PATIENT' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
      { roleCode: 'RESTRICTED_PATIENT_MIGRATION' },
    ])
    cy.signIn()
  })

  describe('Tasks', () => {
    it('should only show help page if there are no roles present', () => {
      cy.task('stubUserRoles', [{ roleCode: 'RANDOM_ROLE' }])
      const page = homepage.goTo()

      page.searchRestrictedPatient().should('not.exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show search restricted patient', () => {
      cy.task('stubUserRoles', [{ roleCode: 'SEARCH_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.searchRestrictedPatient().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show move to hospital', () => {
      cy.task('stubUserRoles', [{ roleCode: 'TRANSFER_RESTRICTED_PATIENT' }])

      const page = homepage.goTo()

      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show migrate into hospital', () => {
      cy.task('stubUserRoles', [{ roleCode: 'RESTRICTED_PATIENT_MIGRATION' }])

      const page = homepage.goTo()

      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show remove from restricted patients', () => {
      cy.task('stubUserRoles', [{ roleCode: 'REMOVE_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show all tasks', () => {
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('exist')
      page.helpLink().should('exist')
    })
  })
})
