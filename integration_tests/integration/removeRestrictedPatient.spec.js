const RestrictedPatientSearchPage = require('../pages/viewRestrictedPatients/restrictedPatientSearch.page')

context('Remove restricted patient', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')

    cy.login()
  })

  it('Progresses to the correct results page', () => {
    cy.visit('/search-for-a-restricted-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
    restrictedPatientSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/select-a-restricted-patient')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })
  })

  it('Handles search form validation', () => {
    cy.visit('/search-for-a-restricted-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.submit().click()

    restrictedPatientSearchPage
      .errorSummaryList()
      .find('li')
      .then($errors => {
        expect($errors.get(0).innerText).to.contain('Enter a restricted patient’s name or prison number')
      })
  })
})
