import { Request, Response } from 'express'
import checkFlashForErrors from './flashMiddleware'

const flashMock = jest.fn()

const req = { flash: flashMock, body: { reportType: 'counterCorruptionReport' } } as unknown as Request
const res = { redirect: jest.fn(), locals: {} } as unknown as Response
const next = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  res.locals = {}
})

describe('flashMessageMiddleware', () => {
  it('should call next if no errors', async () => {
    checkFlashForErrors(req, res, next)
    expect(res.locals).toEqual({})
    expect(next).toBeCalledTimes(1)
  })

  it('should set validation errors if they exist', async () => {
    flashMock
      .mockReturnValueOnce([JSON.stringify({ val: 'error' })])
      .mockReturnValueOnce([JSON.stringify({ form: 'response' })])

    checkFlashForErrors(req, res, next)
    expect(res.locals).toEqual({ validationErrors: { val: 'error' }, formResponse: { form: 'response' } })
    expect(next).toBeCalledTimes(1)
  })
})
