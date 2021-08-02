import { Expose, Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export default class SearchForm {
  @Expose()
  @Transform(value => value && JSON.stringify(value)?.replace(/"/g, ''))
  @IsNotEmpty({ message: 'Enter a restricted patient’s name or prison number' })
  searchTerm?: string
}
