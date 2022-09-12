// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Expose } from 'class-transformer'

export default class Prisoner {
  @Expose()
  prisonerNumber: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  category: string

  @Expose()
  locationDescription: string

  @Expose()
  cellLocation: string
}
