import Page, { PageElement } from '../page'

export default class ChangePrisonConfirmationPage extends Page {
  constructor(prisonerName, prisonName) {
    super(`You are changing ${prisonerName}’s supporting prison to ${prisonName}`)
  }

  confirm = (): PageElement => cy.get('[data-test="confirm-patient-change-submit"]')

  cancel = (): PageElement => cy.get('[data-test="confirm-patient-change-cancel"]')
}
