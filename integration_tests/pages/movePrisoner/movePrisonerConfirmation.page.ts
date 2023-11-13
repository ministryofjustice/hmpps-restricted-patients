import Page, { PageElement } from '../page'

export default class MovePrisonerConfirmationPage extends Page {
  constructor(prisonerName: string, hospitalName: string) {
    super(`You are moving ${prisonerName} to ${hospitalName}`)
  }

  confirm = (): PageElement => cy.get('[data-test="confirm-prisoner-move-submit"]')

  cancel = (): PageElement => cy.get('[data-test="confirm-prisoner-move-cancel"]')
}
