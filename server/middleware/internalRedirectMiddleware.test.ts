import 'reflect-metadata'
import { Request, Response } from 'express'
import internalRedirectMiddleware from './internalRedirectMiddleware'

describe('internalRedirectMiddleware', () => {
  it('should apply internalRedirect on to the response and call next', () => {
    const next = jest.fn()
    const res = {} as Response
    const req = {} as Request

    internalRedirectMiddleware(req, res, next)

    expect(res.internalRedirect).toEqual(expect.any(Function))
    expect(next).toHaveBeenCalledTimes(1)
  })

  describe('internalRedirect', () => {
    it('should prepend the base url to the path and redirect', () => {
      const redirectMock = jest.fn()
      const res = { redirect: redirectMock as unknown } as Response
      const baseUrl = '/my-base-url'
      const req = { baseUrl: `${baseUrl}/////` } as Request
      const url = 'child-path'

      internalRedirectMiddleware(req, res, jest.fn())

      res.internalRedirect(`////${url}////`)
      expect(redirectMock).toHaveBeenCalledWith(`${baseUrl}/${url}/`)
    })
  })
})
