const IndexPage = require('../pages/homepage')
const AuthSignInPage = require('../pages/authSignIn')

context('Frontend Components Fallback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetComponentsMappingError')
    cy.task('stubUserRoles', [
      { roleCode: 'REMOVE_RESTRICTED_PATIENT' },
      { roleCode: 'TRANSFER_RESTRICTED_PATIENT' },
      { roleCode: 'SEARCH_RESTRICTED_PATIENT' },
    ])
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    AuthSignInPage.verifyOnPage()
  })

  it('User can sign out', () => {
    cy.signIn()
    const landingPage = IndexPage.verifyOnPage()
    landingPage.signOutLink().click()
    AuthSignInPage.verifyOnPage()
  })

  describe('Header', () => {
    it('should display the correct details for the logged in user', () => {
      cy.task('stubSignIn')
      cy.signIn()
      const page = IndexPage.goTo()

      page.loggedInName().contains('J. Smith')

      // location and manage account not displayed in fallback
      page.activeLocation().should('not.exist')
      page.manageAccountLink().should('not.exist')
    })

    it('should not show change location link in the fallback', () => {
      cy.task('stubSignIn', {
        caseLoads: [
          {
            caseLoadId: 'MDI',
            description: 'Moorland',
            currentlyActive: true,
          },
          {
            caseLoadId: 'LEI',
            description: 'Leeds',
            currentlyActive: false,
          },
        ],
      })
      cy.signIn()

      const page = IndexPage.goTo()

      page.changeLocationLink().should('not.exist')
    })

    it('Phase banner visible in header', () => {
      cy.signIn()
      const page = IndexPage.goTo()
      page.headerPhaseBanner().should('contain.text', 'dev')
    })
  })
})
