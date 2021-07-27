const PrisonerSearchPage = require('../../pages/prisonerSearch/prisonerSearch.page')
const PrisonerSelectPage = require('../../pages/prisonerSelect/prisonerSelect.page')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  cellLocation: $cell[3].textContent,
  alerts: $cell[4].textContent,
  moveHospitalLink: $cell[5].textContent,
})

context('Prisoner search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.task('stubSearch')
    cy.login()
  })

  it('Searches correctly', () => {
    cy.visit('/search-for-prisoner')
    const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
    const prisonerSearchPageForm = prisonerSearchPage.form()

    prisonerSearchPageForm.searchTerm().type('A1234AA')
    prisonerSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/select-prisoner')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })

    const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

    prisonerSelectPage.resultsTable().then($table => {
      cy.get($table)
        .find('tr')
        .then($tableRows => {
          cy.get($tableRows).its('length').should('eq', 2) // 1 result plus table header

          const offenders = Array.from($tableRows).map($row => toOffender($row.cells))

          expect(offenders[1].name).to.contain('Smith, John')
          expect(offenders[1].prisonerNumber).to.eq('A1234AA')
          expect(offenders[1].cellLocation).to.eq('1-2-015')
          expect(offenders[1].alerts).to.contain('Controlled unlock')
          expect(offenders[1].moveHospitalLink).to.contain('Move to a hospital')
        })
    })
  })

  it('Displays no results message', () => {
    cy.task('stubSearch', { results: [] })

    cy.visit('/search-for-prisoner')
    const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
    const prisonerSearchPageForm = prisonerSearchPage.form()

    prisonerSearchPageForm.searchTerm().type('A1234AA')
    prisonerSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/select-prisoner')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })

    const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

    prisonerSelectPage.resultsTable().should('not.exist')
    prisonerSelectPage
      .noResultsMessage()
      .should('contain', 'There are no results for the name or number you have entered. You can search again.')
  })

  it('Handles search again validation', () => {
    cy.visit('/search-for-prisoner')
    const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
    const prisonerSearchPageForm = prisonerSearchPage.form()

    prisonerSearchPageForm.searchTerm().type('A1234AA')
    prisonerSearchPageForm.submit().click()

    const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()
    const prisonerSelectPageForm = prisonerSelectPage.form()

    prisonerSelectPageForm.searchTerm().clear()
    prisonerSelectPageForm.submit().click()

    prisonerSelectPage
      .errorSummaryList()
      .find('li')
      .then($errors => {
        expect($errors.get(0).innerText).to.contain('Enter a prisoner’s name or number')
      })
  })
})
