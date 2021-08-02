export default class TableViewModel<T> {
  private head: govuk.table.Cell[] = []

  private renders: Array<(data: T, index: number) => govuk.table.Cell> = []

  constructor(private readonly items: T[] = [], private readonly attributes?: Record<string, string>) {}

  addColumn(head: govuk.table.Cell, render: (data: T, index: number) => govuk.table.Cell): TableViewModel<T> {
    this.head.push(head)
    this.renders.push(render)
    return this
  }

  build(): govuk.table.Table {
    const rows =
      this.renders.length === this.head.length
        ? this.items.map((item, index) => this.renders.map(renderer => renderer(item, index)))
        : []
    return {
      attributes: this.attributes,
      head: this.head,
      rows,
    }
  }
}
