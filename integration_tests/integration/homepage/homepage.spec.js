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

  it('should display the feedback banner with the correct href', () => {
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
