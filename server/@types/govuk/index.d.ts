declare namespace govuk {
  namespace table {
    interface TextCell {
      text: string
      attributes?: Record<string, string>
    }

    interface HTMLCell {
      html: string
      attributes?: Record<string, string>
    }

    type Cell = TextCell | HTMLCell

    interface Table {
      head: Cell[]
      rows: Cell[][]
      attributes?: Record<string, string>
    }
  }
}
