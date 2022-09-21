const PrisonerSearchPage = require('../pages/addPrisoner/addPrisonerSearch.page')
const PrisonerSelectPage = require('../pages/addPrisoner/addPrisonerSelect.page')
const homepage = require('../pages/homepage')
const SelectHospitalPage = require('../pages/addPrisoner/addPrisonerSelectHospital.page')
const AddPatientConfirmationPage = require('../pages/addPrisoner/addPatientConfirmation.page')
const AddPatientCompletedPage = require('../pages/addPrisoner/addPatientCompleted.page')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  locationDescription: $cell[3].textContent,
  alerts: $cell[4].textContent,
  addRestrictedPatientLink: $cell[5].textContent,
})

context('Add prisoner', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin', { roles: ['RESTRICTED_PATIENT_MIGRATION'] })
    cy.task('stubAuthUser')
    cy.task('stubUserRoles', [{ roleCode: 'RESTRICTED_PATIENT_MIGRATION' }])
    cy.task('stubSearch', {
      query: {
        equalToJson: {
          prisonerIdentifier: 'A1234AA',
          prisonIds: ['OUT'],
          includeAliases: false,
        },
      },
    })
    cy.task('stubGetAgenciesByType', {
      type: 'HOSPITAL',
      response: [
        {
          agencyId: 'SHEFF',
          description: 'Sheffield Hospital',
          longDescription: 'Sheffield Teaching Hospital',
          agencyType: 'HOSP',
          active: true,
        },
      ],
    })
    cy.task('stubGetAgenciesByType', {
      type: 'HSHOSP',
      response: [
        {
          agencyId: 'ROTH',
          description: 'Rotherham Hospital',
          longDescription: 'Rotherham General Hospital',
          agencyType: 'HSHOSP',
          active: true,
        },
      ],
    })
    cy.task('stubGetAgencyDetails', {
      id: 'SHEFF',
      response: {
        agencyId: 'SHEFF',
        description: 'Sheffield Hospital',
        longDescription: 'Sheffield Teaching Hospital',
        agencyType: 'HOSP',
        active: true,
      },
    })
    cy.task('stubMigrateToHospital', {
      status: 200,
      response: {
        restrictivePatient: {
          supportingPrison: 'MDI',
        },
      },
    })
    cy.task('stubGetPrisonerDetails', {
      prisonerNumber: 'A1234AA',
      response: {
        offenderNo: 'A1234AA',
        firstName: 'JOHN',
        lastName: 'SMITH',
        locationDescription: 'Outside - released from Doncaster',
        categoryCode: 'C',
        alerts: [
          { active: true, alertType: 'T', alertCode: 'TCPA' },
          { active: true, alertType: 'X', alertCode: 'XCU' },
        ],
      },
    })
    cy.login()
  })

  it('should display the search for prisoner page from the homepage', () => {
    const page = homepage.goTo()
    page.addRestrictedPatient().click()
    PrisonerSearchPage.verifyOnPage()
  })

  it('should display the feedback banner with the correct href', () => {
    cy.visit('/add-restricted-patient/search-for-prisoner')
    const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()

    prisonerSearchPage
      .feedbackBanner()
      .find('a')
      .should('contain', 'Give feedback on Digital Prison Services (opens in a new tab)')
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal(
          'https://eu.surveymonkey.com/r/GYB8Y9Q?source=localhost/add-restricted-patient/search-for-prisoner'
        )
      })
  })

  it('Completes a add prisoner journey', () => {
    cy.visit('/add-restricted-patient/search-for-prisoner')
    const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
    const prisonerSearchPageForm = prisonerSearchPage.form()

    prisonerSearchPageForm.searchTerm().type('A1234AA')
    prisonerSearchPageForm.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/add-restricted-patient/select-prisoner')
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
          expect(offenders[1].locationDescription).to.eq('Outside - released from Doncaster')
          expect(offenders[1].alerts).to.contain('Controlled unlock')
          expect(offenders[1].addRestrictedPatientLink).to.contain('Add to restricted patients')
        })
    })
    prisonerSelectPage.addRestrictedPatientLink().click()

    const selectHospitalPage = SelectHospitalPage.verifyOnPage('John Smith')
    const selectHospitalPageForm = selectHospitalPage.form()

    selectHospitalPage.prisonerName().should('contain', 'Smith, John')
    selectHospitalPage.prisonerNumber().should('contain', 'A1234AA')
    selectHospitalPage.prisonerLocation().should('contain', 'Outside - released from Doncaster')
    selectHospitalPage.prisonerAlerts().should('contain', 'Controlled unlock')

    selectHospitalPageForm.hospital().type('Sheff')
    selectHospitalPageForm.submit().click()

    const addPatientConfirmationRoutes = AddPatientConfirmationPage.verifyOnPage('John Smith', 'Sheffield Hospital')
    const addPatientConfirmationRoutesForm = addPatientConfirmationRoutes.form()

    addPatientConfirmationRoutesForm.confirm().click()

    const addPatientCompletedPage = AddPatientCompletedPage.verifyOnPage('John Smith', 'Sheffield Hospital')

    addPatientCompletedPage.finish().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/')
    })
  })

  describe('Select prisoner results page', () => {
    it('Displays no results message', () => {
      cy.task('stubSearch', {
        query: {
          equalToJson: {
            prisonerIdentifier: 'A1234AA',
            prisonIds: ['OUT'],
            includeAliases: false,
          },
        },
        results: [],
      })

      cy.visit('/add-restricted-patient/search-for-prisoner')
      const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
      const prisonerSearchPageForm = prisonerSearchPage.form()

      prisonerSearchPageForm.searchTerm().type('A1234AA')
      prisonerSearchPageForm.submit().click()

      const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

      prisonerSelectPage.resultsTable().should('not.exist')
      prisonerSelectPage.noResultsMessage().should('contain', 'There are no results for the details you have entered.')
    })

    it('Handles search again validation', () => {
      cy.visit('/add-restricted-patient/search-for-prisoner')
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
})
