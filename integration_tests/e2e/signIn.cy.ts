import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'
import HomePage from '../pages/home.page'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: ['REMOVE_RESTRICTED_PATIENT', 'TRANSFER_RESTRICTED_PATIENT', 'SEARCH_RESTRICTED_PATIENT'],
    })
    cy.task('stubManageUser')
    cy.task('stubFrontendComponents')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
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

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(HomePage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  describe('Header', () => {
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
  })
})
