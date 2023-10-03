const RestrictedPatientSearchPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientSearch.page')
const RestrictedPatientSelectPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientSelect.page')
const RemoveRestrictedPatientConfirmationPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientConfirmation.page')
const RemoveRestrictedPatientCompletedPage = require('../pages/removeRestrictedPatient/removeRestrictedPatientCompleted.page')
const homepage = require('../pages/homepage')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  location: $cell[3].textContent,
  removeRestrictedPatientLink: $cell[4].textContent,
})

context('Remove restricted patient', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['REMOVE_RESTRICTED_PATIENT'] })
    cy.task('stubAuthUser')
    cy.task('stubFrontendComponents')
    cy.task('stubUserRoles', [{ roleCode: 'REMOVE_RESTRICTED_PATIENT' }])
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
            dischargedHospitalId: 'SHEFF',
            dischargedHospitalDescription: 'Sheffield Hospital',
            dischargeDate: '2021-08-11',
          },
        ],
      },
    })
    cy.task('stubGetPrisonerDetails', {
      prisonerNumber: 'A1234AA',
      response: {
        offenderNo: 'A1234AA',
        firstName: 'JOHN',
        lastName: 'SMITH',
        assignedLivingUnit: { description: '1-2-015' },
        categoryCode: 'C',
        alerts: [
          { alertType: 'T', alertCode: 'TCPA' },
          { alertType: 'X', alertCode: 'XCU' },
        ],
      },
    })
    cy.task('stubGetPatient', {
      prisonerNumber: 'A1234AA',
      response: {
        hospitalLocation: {
          description: 'Sheffield Hospital',
        },
      },
    })
    cy.task('stubRemovePatient', { prisonerNumber: 'A1234AA' })
    cy.signIn()
  })

  it('should display the search for patient page from the homepage', () => {
    const page = homepage.goTo()
    page.removeFromRestrictedPatients().click()
    RestrictedPatientSearchPage.verifyOnPage()
  })

  it('Progresses through the removal of a restricted patient journey', () => {
    cy.visit('/remove-from-restricted-patients/search-for-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
    restrictedPatientSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/remove-from-restricted-patients/select-patient')
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
          expect(offenders[1].location).to.eq('Sheffield Hospital')
          expect(offenders[1].removeRestrictedPatientLink).to.contain('Remove as a restricted patient')
        })
    })
    restrictedPatientSelectPage.viewPrisonerProfile().should('have.attr', 'href').and('include', '/prisoner/A1234AA')
    restrictedPatientSelectPage
      .removeRestrictedPatientLink()
      .should('have.attr', 'href')
      .and('include', '/remove-from-restricted-patients?prisonerNumber=A1234AA')

    restrictedPatientSelectPage.removeRestrictedPatientLink().click()

    const removeRestrictedPatientConfirmationPage = RemoveRestrictedPatientConfirmationPage.verifyOnPage('John Smith')

    removeRestrictedPatientConfirmationPage.patientName().should('contain', 'Smith, John')
    removeRestrictedPatientConfirmationPage.prisonerNumber().should('contain', 'A1234AA')
    removeRestrictedPatientConfirmationPage.patientHospital().should('contain', 'Sheffield Hospital')

    removeRestrictedPatientConfirmationPage.confirmRemoval().click()

    const removeRestrictedPatientCompletedPage = RemoveRestrictedPatientCompletedPage.verifyOnPage('John Smith')

    removeRestrictedPatientCompletedPage.finishButton().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/')
    })
  })

  it('Cancel the progress through the removal of a restricted patient journey', () => {
    cy.visit('/remove-from-restricted-patients/search-for-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
    restrictedPatientSearchPageForm.submit().click()
    const restrictedPatientSelectPage = RestrictedPatientSelectPage.verifyOnPage()
    restrictedPatientSelectPage.removeRestrictedPatientLink().click()
    const removeRestrictedPatientConfirmationPage = RemoveRestrictedPatientConfirmationPage.verifyOnPage('John Smith')
    removeRestrictedPatientConfirmationPage.cancelRemoval().click()

    const restrictedPatientSelectPage2 = RestrictedPatientSelectPage.verifyOnPage()
    restrictedPatientSelectPage2.form().searchTerm().should('have.value', 'A1234AA')
  })

  it('Handles search form validation', () => {
    cy.visit('/remove-from-restricted-patients/search-for-patient')
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

      cy.visit('/remove-from-restricted-patients/search-for-patient')
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

    it('Handles search again', () => {
      cy.visit('/remove-from-restricted-patients/search-for-patient')
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

      restrictedPatientSelectPageForm.searchTerm().type('A1234AA')
      restrictedPatientSelectPageForm.submit().click()

      restrictedPatientSelectPage.resultsTable().then($table => {
        cy.get($table)
          .find('tr')
          .then($tableRows => {
            cy.get($tableRows).its('length').should('eq', 2) // 1 result plus table header

            const offenders = Array.from($tableRows).map($row => toOffender($row.cells))

            expect(offenders[1].name).to.contain('Smith, John')
          })
      })
    })

    it('Handles empty search from select', () => {
      cy.visit('/remove-from-restricted-patients/select-patient')
      RestrictedPatientSearchPage.verifyOnPage()
    })
  })
})
