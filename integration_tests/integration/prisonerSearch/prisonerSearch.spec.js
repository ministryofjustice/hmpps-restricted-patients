const PrisonerSearchPage = require('../../pages/prisonerSearch/prisonerSearch.page')

context('Prisoner search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.login()
  })

  it('Searches correctly', () => {
    cy.visit('/search-for-prisoner')
    PrisonerSearchPage.verifyOnPage()
    const form = PrisonerSearchPage.form()

    form.searchText().type('Smith')
    form.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/select-prisoner')
      expect(loc.search).to.eq('?searchText=Smith')
    })
  })

  it('Handles validation', () => {
    cy.visit('/search-for-prisoner')
    PrisonerSearchPage.verifyOnPage()
    const form = PrisonerSearchPage.form()

    form.submit().click()

    PrisonerSearchPage.errorSummaryList()
      .find('li')
      .then($errors => {
        expect($errors.get(0).innerText).to.contain('Enter a prisoner’s name or number')
      })
  })
})
