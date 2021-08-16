import { Expose } from 'class-transformer'

export default class RestrictedPatientResult {
  @Expose()
  hospitalLocation: {
    description: string
  }
}
