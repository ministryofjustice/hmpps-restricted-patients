import TableViewModel from './TableViewModel'

describe('TableViewModel', () => {
  const item: Readonly<{ bar: string; foo: string }> = Object.freeze({
    foo: 'bar',
    bar: 'foo',
  })
  const data = Array.from({ length: 2 }).fill(item) as Readonly<{ bar: string; foo: string }>[]

  it('should initialise with empty headers, rows and attributes', () => {
    const tableViewModel = new TableViewModel()
    const actual = tableViewModel.build()
    expect(actual.head).toHaveLength(0)
    expect(actual.rows).toHaveLength(0)
    expect(actual.attributes).toBeUndefined()
  })

  it('should add attributes to the results', () => {
    const attributes = { 'data-test': 'my-attrib' }
    const tableViewModel = new TableViewModel([], attributes)
    const actual = tableViewModel.build()
    expect(actual.attributes).toBe(attributes)
  })

  it('should return headers and rows', () => {
    const tableViewModel = new TableViewModel(data)

    const headOne = { html: '<span>My Foo</span>' }
    const headTwo = { text: 'My Bar' }
    tableViewModel
      .addColumn(headOne, (val, index) => ({
        text: `My ${val.foo} ${index}`,
      }))
      .addColumn(headTwo, (val, index) => ({
        html: `My ${val.bar} ${index}`,
      }))

    const actual = tableViewModel.build()

    expect(actual.head).toEqual([headOne, headTwo])
    expect(actual.rows).toEqual([
      [
        {
          text: `My bar 0`,
        },
        {
          html: `My foo 0`,
        },
      ],
      [
        {
          text: `My bar 1`,
        },
        {
          html: `My foo 1`,
        },
      ],
    ])
  })
})
