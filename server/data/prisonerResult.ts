import { Expose } from 'class-transformer'

export type AlertType = {
  alertType: string
  alertCode: string
}

type AssignedLivingUnit = {
  agencyId: string
  locationId: number
  description: string
  agencyName: string
}

export default class PrisonerResult {
  @Expose()
  offenderNo: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  assignedLivingUnit: AssignedLivingUnit

  @Expose()
  alertsCodes: string[]

  @Expose()
  categoryCode: string

  @Expose()
  alerts: AlertType[]
}
