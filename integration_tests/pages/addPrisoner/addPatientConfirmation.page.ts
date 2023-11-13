import Page, { PageElement } from '../page'

export default class AddPatientConfirmationPage extends Page {
  constructor(prisonerName, hospitalName) {
    super(`You are adding ${prisonerName} to ${hospitalName}`)
  }

  confirm = (): PageElement => cy.get('[data-test="confirm-prisoner-add-submit"]')

  cancel = (): PageElement => cy.get('[data-test="confirm-prisoner-add-cancel"]')
}
