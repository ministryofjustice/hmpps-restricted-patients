const homepage = require('../../pages/homepage')

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.task('stubUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'TRANSFER_RESTRICTED_PATIENT' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
      { roleCode: 'RESTRICTED_PATIENT_MIGRATION' },
    ])
    cy.login()
  })

  describe('Tasks', () => {
    it('should return a 401 if there are no roles present', () => {
      cy.task('stubUserRoles', [{ roleCode: 'RANDOM_ROLE' }])
      cy.request({ url: '/', failOnStatusCode: false }).then(res => expect(res.status).to.eq(401))
    })
    it('should show search restricted patient', () => {
      cy.task('stubUserRoles', [{ roleCode: 'SEARCH_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.searchRestrictedPatient().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
    })
    it('should show move to hospital', () => {
      cy.task('stubUserRoles', [{ roleCode: 'TRANSFER_RESTRICTED_PATIENT' }])

      const page = homepage.goTo()

      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
    })
    it('should show migrate into hospital', () => {
      cy.task('stubUserRoles', [{ roleCode: 'RESTRICTED_PATIENT_MIGRATION' }])

      const page = homepage.goTo()

      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
    })
    it('should show remove from restricted patients', () => {
      cy.task('stubUserRoles', [{ roleCode: 'REMOVE_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('not.exist')
      page.addRestrictedPatient().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
    })
    it('should show all tasks', () => {
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('exist')
      page.addRestrictedPatient().should('exist')
      page.searchRestrictedPatient().should('exist')
    })
  })

  it('should display the feedback banner with the correct href', () => {
    const page = homepage.goTo()
    page
      .feedbackBanner()
      .find('a')
      .should('contain', 'Give feedback on Digital Prison Services (opens in a new tab)')
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('https://eu.surveymonkey.com/r/GYB8Y9Q?source=localhost/')
      })
  })
})
