const IndexPage = require('../pages/homepage')
const AuthSignInPage = require('../pages/authSignIn')

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubFrontendComponents')
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
      page.activeLocation().contains('Moorland')

      page
        .manageAccountLink()
        .should('have.attr', 'href')
        .then(href => {
          expect(href).to.equal('http://localhost:9091/auth/account-details')
        })

      page.changeLocationLink().should('not.exist')
    })

    it('should show change location link when user has more than 1 caseload', () => {
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
