const IndexPage = require('../pages/homepage')
const AuthLoginPage = require('../pages/authLogin')

context('Login', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubLogin')
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
    AuthLoginPage.verifyOnPage()
  })

  it('User can log out', () => {
    cy.login()
    const landingPage = IndexPage.verifyOnPage()
    landingPage.logoutLink().click()
    AuthLoginPage.verifyOnPage()
  })

  describe('Header', () => {
    it('should display the correct details for the logged in user', () => {
      cy.task('stubLogin')
      cy.login()
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
      cy.task('stubLogin', {
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
      cy.login()

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
