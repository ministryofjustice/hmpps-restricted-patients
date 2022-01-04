const RestrictedPatientSearchPage = require('../pages/viewRestrictedPatients/restrictedPatientSearch.page')
const ViewRestrictedPatientsPage = require('../pages/viewRestrictedPatients/viewRestrictedPatients.page')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  location: $cell[3].textContent,
  addACaseNoteLink: $cell[4].textContent,
})

context('View restricted patients', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.task('stubUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'PRISON_RECEPTION' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
    ])
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
            supportingPrisonId: 'DNI',
            dischargedHospitalId: 'HAZLWD',
            dischargedHospitalDescription: 'Hazelwood House',
            dischargeDate: '2021-06-07',
            dischargeDetails: 'Psychiatric Hospital Discharge to Hazelwood House',
          },
        ],
      },
    })
    cy.login()
  })

  it('should display the feedback banner with the correct href', () => {
    cy.visit('/search-for-restricted-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()

    restrictedPatientSearchPage
      .feedbackBanner()
      .find('a')
      .should('contain', 'Give feedback on Digital Prison Services (opens in a new tab)')
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('https://eu.surveymonkey.com/r/GYB8Y9Q?source=localhost/search-for-restricted-patient')
      })
  })

  it('Shows Restricted Patients', () => {
    cy.visit('/search-for-restricted-patient')
    const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
    const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

    restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
    restrictedPatientSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/viewing-restricted-patients')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })

    const viewRestrictedPatientsPage = ViewRestrictedPatientsPage.verifyOnPage()

    viewRestrictedPatientsPage.resultsTable().then($table => {
      cy.get($table)
        .find('tr')
        .then($tableRows => {
          cy.get($tableRows).its('length').should('eq', 2) // 1 result plus table header

          const offenders = Array.from($tableRows).map($row => toOffender($row.cells))

          expect(offenders[1].name).to.contain('Smith, John')
          expect(offenders[1].prisonerNumber).to.eq('A1234AA')
          expect(offenders[1].location).to.eq('Hazelwood House')
          expect(offenders[1].addACaseNoteLink).to.contain('Add a case note')
        })
    })
    viewRestrictedPatientsPage.viewPrisonerProfile().should('have.attr', 'href').and('include', '/prisoner/A1234AA')
    viewRestrictedPatientsPage
      .addCaseNotes()
      .should('have.attr', 'href')
      .and('include', '/prisoner/A1234AA/add-case-note')
  })

  describe('View restricted patients results page', () => {
    it('Displays no results message', () => {
      cy.task('stubRestrictedPatientSearch', {
        results: {
          content: [],
        },
      })

      cy.visit('/search-for-restricted-patient')
      const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
      const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

      restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
      restrictedPatientSearchPageForm.submit().click()

      const viewRestrictedPatientsPage = ViewRestrictedPatientsPage.verifyOnPage()

      viewRestrictedPatientsPage.resultsTable().should('not.exist')
      viewRestrictedPatientsPage
        .noResultsMessage()
        .should('contain', 'There are no results for the details you have entered.')
    })

    it('Handles search again validation', () => {
      cy.task('stubRestrictedPatientSearch', {
        results: {
          content: [],
        },
      })

      cy.visit('/search-for-restricted-patient')
      const restrictedPatientSearchPage = RestrictedPatientSearchPage.verifyOnPage()
      const restrictedPatientSearchPageForm = restrictedPatientSearchPage.form()

      restrictedPatientSearchPageForm.searchTerm().type('A1234AA')
      restrictedPatientSearchPageForm.submit().click()

      const viewRestrictedPatientsPage = ViewRestrictedPatientsPage.verifyOnPage()
      const viewRestrictedPatientsPageForm = viewRestrictedPatientsPage.form()

      viewRestrictedPatientsPageForm.searchTerm().clear()
      viewRestrictedPatientsPageForm.submit().click()

      viewRestrictedPatientsPage
        .errorSummaryList()
        .find('li')
        .then($errors => {
          expect($errors.get(0).innerText).to.contain('Enter a restricted patient’s name or prison number')
        })
    })
  })
})
