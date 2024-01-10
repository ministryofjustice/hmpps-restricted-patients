import HomePage from '../pages/home.page'

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', [
      'REMOVE_RESTRICTED_PATIENT',
      'TRANSFER_RESTRICTED_PATIENT',
      'SEARCH_RESTRICTED_PATIENT',
      'RESTRICTED_PATIENT_MIGRATION',
    ])
    cy.task('stubManageUser')
    cy.task('stubFrontendComponents')
  })

  describe('Tasks', () => {
    it('should only show help page if there are no roles present', () => {
      cy.task('stubSignIn', ['RANDOM_ROLE'])
      cy.signIn()

      const page = HomePage.goTo()

      page.searchRestrictedPatient().should('not.exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show search restricted patient', () => {
      cy.task('stubSignIn', ['SEARCH_RESTRICTED_PATIENT'])
      cy.signIn()

      const page = HomePage.goTo()

      page.searchRestrictedPatient().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show move to hospital', () => {
      cy.task('stubSignIn', ['TRANSFER_RESTRICTED_PATIENT'])
      cy.signIn()

      const page = HomePage.goTo()

      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show migrate into hospital', () => {
      cy.task('stubSignIn', ['RESTRICTED_PATIENT_MIGRATION'])
      cy.signIn()

      const page = HomePage.goTo()

      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show remove from restricted patients', () => {
      cy.task('stubSignIn', ['REMOVE_RESTRICTED_PATIENT'])
      cy.signIn()

      const page = HomePage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.helpLink().should('exist')
    })
    it('should show all tasks', () => {
      cy.signIn()

      const page = HomePage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('exist')
      page.helpLink().should('exist')
    })
  })
})
