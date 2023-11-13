import Page, { PageElement } from './page'

export default class ErrorPage extends Page {
  constructor(errorMessage: string) {
    super(errorMessage)
  }

  continue = (): PageElement => cy.get('[data-test="continue-after-error"]')
}
