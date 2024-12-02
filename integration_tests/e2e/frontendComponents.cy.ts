import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import HomePage from '../pages/home.page'
import AuthManageDetailsPage from '../pages/authManageDetails'
import PrisonerSearchPage from '../pages/addPrisoner/addPrisonerSearch.page'

context('Frontend Components', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['RESTRICTED_PATIENT_MIGRATION'] })
    cy.task('stubManageUser')
    cy.task('stubFrontendComponents')
  })

  it('User can sign out', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(HomePage)
    landingPage.signOutLink().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const homePage = Page.verifyOnPage(HomePage)

    homePage.manageDetails().get('a').invoke('removeAttr', 'target')
    homePage.manageDetails().click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })
  it('User name visible in header', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    homePage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Phase banner visible in header', () => {
    cy.signIn()
    const homePage = Page.verifyOnPage(HomePage)
    homePage.headerPhaseBanner().should('contain.text', 'DEV')
  })
  it('should display the correct details for the signed in user', () => {
    cy.task('stubSignIn')
    cy.signIn()
    const page = Page.verifyOnPage(HomePage)

    page.headerUserName().contains('J. Smith')
    page.activeLocation().contains('Moorland')

    page
      .manageAccountLink()
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('http://localhost:9091/auth/account-details')
      })
  })

  it('should show change location link when user has more than 1 caseload', () => {
    cy.task('stubSignIn')
    cy.signIn()

    const page = Page.verifyOnPage(HomePage)

    page
      .changeLocationLink()
      .should('be.visible')
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('http://localhost:3002/change-caseload')
      })
  })

  it('should display header even for post request errors', () => {
    cy.signIn()
    cy.visit('/add-restricted-patient/search-for-prisoner')
    const page = Page.verifyOnPage(PrisonerSearchPage)
    page.submit().click()

    page.headerUserName().should('contain.text', 'J. Smith')
    page.activeLocation().contains('Moorland')
    page.signOutLink().should('exist')
  })
})
