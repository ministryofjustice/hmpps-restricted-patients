import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
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

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(HomePage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })
})
