import HomePage from '../pages/home.page'

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubFrontendComponents')
    cy.task('stubManageUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'TRANSFER_RESTRICTED_PATIENT' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
      { roleCode: 'RESTRICTED_PATIENT_MIGRATION' },
    ])
    cy.signIn()
  })

  describe('Tasks', () => {
    it('should only show help page if there are no roles present', () => {
      cy.task('stubManageUserRoles', [{ roleCode: 'RANDOM_ROLE' }])
      const page = HomePage.goTo()

      page.searchRestrictedPatient().should('not.exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show search restricted patient', () => {
      cy.task('stubManageUserRoles', [{ roleCode: 'SEARCH_RESTRICTED_PATIENT' }])
      const page = HomePage.goTo()

      page.searchRestrictedPatient().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show move to hospital', () => {
      cy.task('stubManageUserRoles', [{ roleCode: 'TRANSFER_RESTRICTED_PATIENT' }])

      const page = HomePage.goTo()

      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show migrate into hospital', () => {
      cy.task('stubManageUserRoles', [{ roleCode: 'RESTRICTED_PATIENT_MIGRATION' }])

      const page = HomePage.goTo()

      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show remove from restricted patients', () => {
      cy.task('stubManageUserRoles', [{ roleCode: 'REMOVE_RESTRICTED_PATIENT' }])
      const page = HomePage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show all tasks', () => {
      const page = HomePage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('exist')
      page.helpLink().should('exist')
    })
  })
})
