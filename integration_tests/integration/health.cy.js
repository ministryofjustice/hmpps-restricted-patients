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
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('All dependant APIs are healthy', () => {
      cy.request('/health').then(response => {
        expect(response.body.components).to.deep.eq({
          hmppsAuth: { status: 'UP', details: 'UP' },
          prisonerOffenderSearch: { status: 'UP', details: 'UP' },
          tokenVerification: { status: 'UP', details: 'UP' },
          prisonApi: { status: 'UP', details: 'UP' },
          restrictedPatientApi: { status: 'UP', details: 'UP' },
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
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.status').should('equal', 'DOWN')
    })

    it('All dependant APIs are unhealthy', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.components.hmppsAuth.status).to.equal('DOWN')
        expect(response.body.components.prisonerOffenderSearch.status).to.equal('DOWN')
        expect(response.body.components.prisonerOffenderSearch.details).to.contain({ status: 500, retries: 2 })
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, retries: 2 })
        expect(response.body.components.prisonApi.status).to.equal('DOWN')
        expect(response.body.components.restrictedPatientApi.status).to.equal('DOWN')
      })
    })
  })
})
