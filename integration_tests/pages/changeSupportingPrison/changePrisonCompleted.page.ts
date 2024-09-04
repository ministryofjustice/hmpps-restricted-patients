import Page, { PageElement } from '../page'

export default class ChangePrisonCompletedPage extends Page {
  constructor(prisonerName) {
    super(`The supporting prison for ${prisonerName} has been changed`)
  }

  informationMessage = (): PageElement => cy.get('[data-test="patient-change-completed-help-text"]')

  finish = (): PageElement => cy.get('[data-test="patient-change-completed-finish"]')
}
