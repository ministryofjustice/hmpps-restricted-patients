const homepage = require('../../pages/homepage')

context('Homepage', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubAuthUser')
  })

  describe('Tasks', () => {
    beforeEach(() => {
      cy.task('stubLogin')
      cy.login()
    })
    it('should show an error page with link to the DPS homepage if there are no roles present', () => {
      cy.task('stubUserRoles', [])
      cy.visit(`/`)
      cy.get('h1').should('contain', 'You do not have permission to view this page')
    })
    it('should show search restricted patient', () => {
      cy.task('stubUserRoles', [{ roleCode: 'SEARCH_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.searchRestrictedPatient().should('exist')
      page.moveToHospital().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
    })
    it('should show move to hospital', () => {
      cy.task('stubUserRoles', [{ roleCode: 'PRISON_RECEPTION' }])

      const page = homepage.goTo()

      page.moveToHospital().should('exist')
      page.searchRestrictedPatient().should('not.exist')
      page.removeFromRestrictedPatients().should('not.exist')
    })
    it('should show remove from restricted patients', () => {
      cy.task('stubUserRoles', [{ roleCode: 'REMOVE_RESTRICTED_PATIENT' }])
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('not.exist')
      page.searchRestrictedPatient().should('not.exist')
    })
    it('should show all tasks', () => {
      cy.task('stubUserRoles', [
        { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
        { roleCode: 'PRISON_RECEPTION' },
        { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
      ])
      const page = homepage.goTo()

      page.removeFromRestrictedPatients().should('exist')
      page.moveToHospital().should('exist')
      page.searchRestrictedPatient().should('exist')
    })
  })

  it('should display the feedback banner with the correct href', () => {
    cy.task('stubUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'PRISON_RECEPTION' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
    ])
    cy.task('stubLogin')
    cy.login()
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
