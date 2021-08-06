const PrisonerSearchPage = require('../pages/movePrisoner/movePrisonerSearch.page')
const PrisonerSelectPage = require('../pages/movePrisoner/movePrisonerSelect.page')
const MovePrisonerSelectHospitalPage = require('../pages/movePrisoner/movePrisonerSelectHospital.page')
const MovePrisonerConfirmationPage = require('../pages/movePrisoner/movePrisonerConfirmation.page')

const toOffender = $cell => ({
  name: $cell[1].textContent,
  prisonerNumber: $cell[2].textContent,
  cellLocation: $cell[3].textContent,
  alerts: $cell[4].textContent,
  moveHospitalLink: $cell[5].textContent,
})

context.only('Move prisoner', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
    cy.task('stubAuthUser')
    cy.task('stubSearch')
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
    cy.task('stubDischargeToHospital', {
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
        assignedLivingUnit: { description: '1-2-015' },
        categoryCode: 'C',
        alerts: [
          { alertType: 'T', alertCode: 'TCPA' },
          { alertType: 'X', alertCode: 'XCU' },
        ],
      },
    })
    cy.login()
  })

  it('Completes a move prisoner journey', () => {
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
    prisonerSelectPage.moveToHospitalLink().click()

    const movePrisonerSelectHospitalPage = MovePrisonerSelectHospitalPage.verifyOnPage('John Smith')
    const movePrisonerSelectHospitalPageForm = movePrisonerSelectHospitalPage.form()

    movePrisonerSelectHospitalPage.prisonerName().should('contain', 'Smith, John')
    movePrisonerSelectHospitalPage.prisonerNumber().should('contain', 'A1234AA')
    movePrisonerSelectHospitalPage.prisonerCell().should('contain', '1-2-015')
    movePrisonerSelectHospitalPage.prisonerAlerts().should('contain', 'Controlled unlock')

    movePrisonerSelectHospitalPageForm.hospital().select('SHEFF')
    movePrisonerSelectHospitalPageForm.submit().click()

    const movePrisonerConfirmationPage = MovePrisonerConfirmationPage.verifyOnPage('John Smith', 'Sheffield Hospital')
    const movePrisonerConfirmationPageForm = movePrisonerConfirmationPage.form()

    movePrisonerConfirmationPageForm.confirm().click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/prisoner-moved-to-hospital/A1234AA/SHEFF')
    })
  })

  describe('Select prisoner results page', () => {
    it('Displays no results message', () => {
      cy.task('stubSearch', { results: [] })

      cy.visit('/search-for-prisoner')
      const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
      const prisonerSearchPageForm = prisonerSearchPage.form()

      prisonerSearchPageForm.searchTerm().type('A1234AA')
      prisonerSearchPageForm.submit().click()

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

  describe('Select hospital page', () => {
    it('Handles select hospital validation', () => {
      cy.visit('/search-for-prisoner')
      const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
      const prisonerSearchPageForm = prisonerSearchPage.form()

      prisonerSearchPageForm.searchTerm().type('A1234AA')
      prisonerSearchPageForm.submit().click()

      const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

      prisonerSelectPage.moveToHospitalLink().click()

      const movePrisonerSelectHospitalPage = MovePrisonerSelectHospitalPage.verifyOnPage('John Smith')
      const movePrisonerSelectHospitalPageForm = movePrisonerSelectHospitalPage.form()

      movePrisonerSelectHospitalPageForm.submit().click()

      movePrisonerSelectHospitalPage
        .errorSummaryList()
        .find('li')
        .then($errors => {
          expect($errors.get(0).innerText).to.contain('Select a hospital')
        })
    })

    it('Redirects back to search results when clicking cancel', () => {
      cy.visit('/search-for-prisoner')
      const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
      const prisonerSearchPageForm = prisonerSearchPage.form()

      prisonerSearchPageForm.searchTerm().type('A1234AA')
      prisonerSearchPageForm.submit().click()

      const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

      prisonerSelectPage.moveToHospitalLink().click()

      const movePrisonerSelectHospitalPage = MovePrisonerSelectHospitalPage.verifyOnPage('John Smith')
      const movePrisonerSelectHospitalPageForm = movePrisonerSelectHospitalPage.form()

      movePrisonerSelectHospitalPageForm.cancel().click()

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/select-prisoner')
        expect(loc.search).to.eq('?searchTerm=A1234AA')
      })
    })
  })

  describe('Confirm move page', () => {
    it('Redirects back to search results when clicking cancel', () => {
      cy.visit('/search-for-prisoner')
      const prisonerSearchPage = PrisonerSearchPage.verifyOnPage()
      const prisonerSearchPageForm = prisonerSearchPage.form()

      prisonerSearchPageForm.searchTerm().type('A1234AA')
      prisonerSearchPageForm.submit().click()

      const prisonerSelectPage = PrisonerSelectPage.verifyOnPage()

      prisonerSelectPage.moveToHospitalLink().click()

      const movePrisonerSelectHospitalPage = MovePrisonerSelectHospitalPage.verifyOnPage('John Smith')
      const movePrisonerSelectHospitalPageForm = movePrisonerSelectHospitalPage.form()

      movePrisonerSelectHospitalPageForm.hospital().select('SHEFF')
      movePrisonerSelectHospitalPageForm.submit().click()

      const movePrisonerConfirmationPage = MovePrisonerConfirmationPage.verifyOnPage('John Smith', 'Sheffield Hospital')
      const movePrisonerConfirmationPageForm = movePrisonerConfirmationPage.form()

      movePrisonerConfirmationPageForm.cancel().click()

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/select-prisoner')
        expect(loc.search).to.eq('?searchTerm=A1234AA')
      })
    })
  })
})
