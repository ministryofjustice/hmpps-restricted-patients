import Page, { PageElement } from '../page'

export default class RemoveRestrictedPatientConfirmationPage extends Page {
  constructor(prisonerName: string) {
    super(`You are removing ${prisonerName} from restricted patients`)
  }

  patientName = (): PageElement => cy.get('[data-test="patient-name"]')

  prisonerNumber = (): PageElement => cy.get('[data-test="prisoner-number"]')

  patientHospital = (): PageElement => cy.get('[data-test="patient-hospital"]')

  confirmRemoval = (): PageElement => cy.get('[data-test="confirm-patient-removal-submit"]')

  cancelRemoval = (): PageElement => cy.get('[data-test="confirm-patient-removal-cancel"]')
}
