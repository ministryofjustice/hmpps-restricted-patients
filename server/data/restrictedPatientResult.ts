// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Expose } from 'class-transformer'

export default class RestrictedPatientResult {
  @Expose()
  hospitalLocation: {
    description: string
  }
}
