// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Expose } from 'class-transformer'
import RestrictedPatientSearchResult from './restrictedPatientSearchResult'

export default class RestrictedPatientSearchResults {
  @Expose()
  content: RestrictedPatientSearchResult[]
}
