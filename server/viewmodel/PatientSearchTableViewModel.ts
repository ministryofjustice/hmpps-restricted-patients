import TableViewModel from './TableViewModel'
import { RestrictedPatientSearchSummary } from '../services/restrictedPatientSearchService'
import config from '../config'

export default class PatientSearchTableViewModel extends TableViewModel<RestrictedPatientSearchSummary> {
  constructor(items: RestrictedPatientSearchSummary[]) {
    super(items, {
      'data-test': 'patient-search-results-table',
      'data-module': 'moj-sortable-table',
    })

    this.addColumn({ html: '<span class="govuk-visually-hidden">Picture</span>' }, this.renderImage)
      .addColumn({ text: 'Name', attributes: { 'aria-sort': 'ascending' } }, this.renderDisplayName)
      .addColumn({ text: 'Prison number' }, this.renderPrisonNumber)
      .addColumn({ text: 'Hospital', attributes: { 'aria-sort': 'none' } }, this.renderLocation)
  }

  private renderPrisonNumber(prisoner: RestrictedPatientSearchSummary) {
    return { text: prisoner.prisonerNumber }
  }

  private renderImage(prisoner: RestrictedPatientSearchSummary) {
    return {
      html: `<img src="/prisoner/${prisoner.prisonerNumber}/image" alt="Photograph of ${prisoner.displayName}" class="results-table__image" />`,
    }
  }

  private renderDisplayName(prisoner: RestrictedPatientSearchSummary) {
    return {
      html: `<a href="${config.pshUrl}/prisoner/${prisoner.prisonerNumber}" class="govuk-link">${prisoner.displayName}</a>`,
    }
  }

  private renderLocation(prisoner: RestrictedPatientSearchSummary) {
    return {
      text: prisoner.dischargedHospitalDescription,
    }
  }
}
