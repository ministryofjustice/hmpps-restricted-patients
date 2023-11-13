import Page, { PageElement } from '../page'

export default class MovePrisonerCompletedPage extends Page {
  constructor(prisonerName: string, hospitalName: string) {
    super(`${prisonerName} has been moved to ${hospitalName}`)
  }

  informationMessage = (): PageElement => cy.get('[data-test="prisoner-move-completed-help-text"]')

  finish = (): PageElement => cy.get('[data-test="prisoner-move-completed-finish"]')
}
