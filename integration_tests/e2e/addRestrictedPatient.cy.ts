import PrisonerSearchPage from '../pages/addPrisoner/addPrisonerSearch.page'
import PrisonerSelectPage from '../pages/addPrisoner/addPrisonerSelect.page'
import HomePage from '../pages/home.page'
import SelectHospitalPage from '../pages/addPrisoner/addPrisonerSelectHospital.page'
import AddPatientConfirmationPage from '../pages/addPrisoner/addPatientConfirmation.page'
import AddPatientCompletedPage from '../pages/addPrisoner/addPatientCompleted.page'
import Page from '../pages/page'

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
    cy.task('stubSignIn', { roles: ['RESTRICTED_PATIENT_MIGRATION'] })
    cy.task('stubManageUser')
    cy.task('stubFrontendComponents')
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
    cy.signIn()
  })

  it('should display the search for prisoner page from the HomePage', () => {
    const page = Page.verifyOnPage(HomePage)
    page.addRestrictedPatient().click()
    Page.verifyOnPage(PrisonerSearchPage)
  })

  it('Completes a add prisoner journey', () => {
    cy.visit('/add-restricted-patient/search-for-prisoner')
    const prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)

    prisonerSearchPage.searchTerm().type('A1234AA')
    prisonerSearchPage.submit().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/add-restricted-patient/select-prisoner')
      expect(loc.search).to.eq('?searchTerm=A1234AA')
    })

    const prisonerSelectPage = Page.verifyOnPage(PrisonerSelectPage)

    prisonerSelectPage
      .resultsTable()
      .find('tr')
      .should($tableRows => {
        expect($tableRows).to.have.length(2) // 1 result plus table header

        const offenders = Array.from($tableRows).map($row => toOffender($row.cells))

        expect(offenders[1].name).to.contain('Smith, John')
        expect(offenders[1].prisonerNumber).to.eq('A1234AA')
        expect(offenders[1].locationDescription).to.eq('Outside - released from Doncaster')
        expect(offenders[1].alerts).to.contain('Controlled unlock')
        expect(offenders[1].addRestrictedPatientLink).to.contain('Add to restricted patients')
      })
    prisonerSelectPage.addRestrictedPatientLink().click()

    const selectHospitalPage = Page.verifyOnPageWithTitleParam(SelectHospitalPage, 'John Smith')

    selectHospitalPage.prisonerName().should('contain', 'Smith, John')
    selectHospitalPage.prisonerNumber().should('contain', 'A1234AA')
    selectHospitalPage.prisonerLocation().should('contain', 'Outside - released from Doncaster')
    selectHospitalPage.prisonerAlerts().should('contain', 'Controlled unlock')

    selectHospitalPage.hospital().type('Sheff')
    selectHospitalPage.submit().click()

    const addPatientConfirmationRoutes = Page.verifyOnPageWithTwoTitleParams(
      AddPatientConfirmationPage,
      'John Smith',
      'Sheffield Hospital',
    )

    addPatientConfirmationRoutes.confirm().click()

    const addPatientCompletedPage = Page.verifyOnPageWithTwoTitleParams(
      AddPatientCompletedPage,
      'John Smith',
      'Sheffield Hospital',
    )

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
      const prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)

      prisonerSearchPage.searchTerm().type('A1234AA')
      prisonerSearchPage.submit().click()

      const prisonerSelectPage = Page.verifyOnPage(PrisonerSelectPage)

      prisonerSelectPage.resultsTable().should('not.exist')
      prisonerSelectPage.noResultsMessage().should('contain', 'There are no results for the details you have entered.')
    })

    it('Handles search again validation', () => {
      cy.visit('/add-restricted-patient/search-for-prisoner')
      const prisonerSearchPage = Page.verifyOnPage(PrisonerSearchPage)

      prisonerSearchPage.searchTerm().type('A1234AA')
      prisonerSearchPage.submit().click()

      const prisonerSelectPage = Page.verifyOnPage(PrisonerSelectPage)

      prisonerSelectPage.searchTerm().clear()
      prisonerSelectPage.submit().click()

      prisonerSelectPage
        .errorSummaryList()
        .find('li')
        .then($errors => {
          expect($errors.get(0).innerText).to.contain('Enter a prisoner’s name or number')
        })
    })
  })
})
