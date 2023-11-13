import Page, { PageElement } from '../page'

export default class AddPatientCompletedPage extends Page {
  constructor(prisonerName, hospitalName) {
    super(`${prisonerName} has been added to ${hospitalName}`)
  }

  informationMessage = (): PageElement => cy.get('[data-test="prisoner-add-completed-help-text"]')

  finish = (): PageElement => cy.get('[data-test="prisoner-add-completed-finish"]')
}
