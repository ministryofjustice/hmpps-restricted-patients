context('Healthcheck', () => {
  context('Healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing')
      cy.task('stubSearchPing')
      cy.task('stubPrisonApiPing')
      cy.task('stubRestrictedPatientApiPing')
    })

    it('Health check page is visible', () => {
      cy.request('/health').its('body.healthy').should('equal', true)
    })

    it('All dependant APIs are healthy', () => {
      cy.request('/health').then(response => {
        expect(response.body.checks).to.deep.eq({
          hmppsAuth: 'OK',
          prisonerOffenderSearch: 'OK',
          tokenVerification: 'OK',
          prisonApi: 'OK',
          restrictedPatientApi: 'OK',
        })
      })
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })
  })

  context('Unhealthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing', 500)
      cy.task('stubTokenVerificationPing', 500)
      cy.task('stubSearchPing', 500)
      cy.task('stubPrisonApiPing', 500)
      cy.task('stubRestrictedPatientApiPing', 500)
    })

    it('Health check page is visible', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.healthy').should('equal', false)
    })

    it('All dependant APIs are healthy', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.checks.hmppsAuth.status).to.eq(500)
        expect(response.body.checks.prisonerOffenderSearch.status).to.eq(500)
        expect(response.body.checks.tokenVerification.status).to.eq(500)
        expect(response.body.checks.prisonApi.status).to.eq(500)
        expect(response.body.checks.restrictedPatientApi.status).to.eq(500)
      })
    })
  })
})
