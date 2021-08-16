const RestrictedPatientSearchPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientSearch.page')
const RestrictedPatientSelectPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientSelect.page')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  location: $cell[3].textContent,
  removeRestrictedPatientLink: $cell[4].textContent,
})

context('Remove restricted patient', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.task('stubRestrictedPatientSearch', {
      query: {
        equalToJson: {
          prisonerIdentifier: 'A1234AA',
        },
      },
      results: {
        content: [
          {
            cellLocation: '1-2-015',
            firstName: 'JOHN',
            lastName: 'SMITH',
            prisonerNumber: 'A1234AA',
            prisonName: 'HMP Moorland',
            supportingPrisonId: 'MDI',
            dischargedHospitalId: 'RIDGHO',
            dischargedHospitalDescription: 'Ridge Lea Hospital',
            dischargeDate: '2021-08-11',
          },
        ],
      },
    })
    cy.login()
  })

  it('Progresses through the removal of a restricted patient journey', () => {
    cy.visit('/search-for-a-restricted-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
    restrictedPatientSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/select-restricted-patient')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })

    const restrictedPatientSelectPage = RestrictedPatientSelectPage.verifyOnPage()

    restrictedPatientSelectPage.resultsTable().then($table => {
      cy.get($table)
        .find('tr')
        .then($tableRows => {
          cy.get($tableRows).its('length').should('eq', 2) // 1 result plus table header

          const offenders = Array.from($tableRows).map($row => toOffender($row.cells))

          expect(offenders[1].name).to.contain('Smith, John')
          expect(offenders[1].prisonerNumber).to.eq('A1234AA')
          expect(offenders[1].location).to.eq('Ridge Lea Hospital')
          expect(offenders[1].removeRestrictedPatientLink).to.contain('Remove as a restricted patient')
        })
    })
    restrictedPatientSelectPage.viewPrisonerProfile().should('have.attr', 'href').and('include', '/prisoner/A1234AA')
    restrictedPatientSelectPage
      .removeRestrictedPatientLink()
      .should('have.attr', 'href')
      .and('include', '/remove-from-restricted-patients/A1234AA')
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

  describe('View restricted patients results page', () => {
    it('Displays no results message', () => {
      cy.task('stubRestrictedPatientSearch', {
        results: {
          content: [],
        },
      })

      cy.visit('/search-for-a-restricted-patient')
      const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
      const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

      restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
      restrictedPatientSearchPageForm.submit().click()

      const restrictedPatientSelectPage = RestrictedPatientSelectPage.verifyOnPage()

      restrictedPatientSelectPage.resultsTable().should('not.exist')
      restrictedPatientSelectPage
        .noResultsMessage()
        .should('contain', 'There are no results for the details you have entered.')
    })

    it('Handles search again validation', () => {
      cy.task('stubRestrictedPatientSearch', {
        results: {
          content: [],
        },
      })

      cy.visit('/search-for-a-restricted-patient')
      const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
      const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

      restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
      restrictedPatientSearchPageForm.submit().click()

      const restrictedPatientSelectPage = RestrictedPatientSelectPage.verifyOnPage()
      const restrictedPatientSelectPageForm = restrictedPatientSelectPage.form()

      restrictedPatientSelectPageForm.searchTerm().clear()
      restrictedPatientSelectPageForm.submit().click()

      restrictedPatientSelectPage
        .errorSummaryList()
        .find('li')
        .then($errors => {
          expect($errors.get(0).innerText).to.contain('Enter a restricted patient’s name or prison number')
        })
    })
  })
})
