import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import HomePage from '../pages/home.page'

context('Frontend Components Fallback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: ['REMOVE_RESTRICTED_PATIENT', 'TRANSFER_RESTRICTED_PATIENT', 'SEARCH_RESTRICTED_PATIENT'],
    })
    cy.task('stubManageUser')
    cy.task('stubGetComponentsMappingError')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can sign out', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(HomePage)
    landingPage.signOutLink().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  describe('Header', () => {
    it('should not should user name for the signed in user', () => {
      cy.task('stubSignIn', { name: 'Bobby Brown' })
      cy.signIn()
      const page = Page.verifyOnPage(HomePage)

      // headder, location and manage account not displayed in fallback
      page.headerUserName().should('not.exist')
      page.activeLocation().should('not.exist')
      page.manageAccountLink().should('not.exist')
    })

    it('should not show change location link in the fallback', () => {
      cy.task('stubSignIn')
      cy.signIn()

      const page = Page.verifyOnPage(HomePage)

      page.changeLocationLink().should('not.exist')
    })
  })
})
