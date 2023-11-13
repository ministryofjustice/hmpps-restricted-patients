import Page, { PageElement } from '../page'

export default class RemoveRestrictedPatientCompletedPage extends Page {
  constructor(prisonerName: string) {
    super(`${prisonerName} has been removed from restricted patients`)
  }

  finishButton = (): PageElement => cy.get('[data-test="restricted-patient-removal-completed-finish"]')
}
