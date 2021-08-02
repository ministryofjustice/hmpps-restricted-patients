// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata'
import { Request, Response } from 'express'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import validationMiddleware from './requestValidationMiddleware'

describe('validationMiddleware', () => {
  describe('middleware', () => {
    const notEmptyMessage = 'not empty'

    class DummyChild {
      @Expose()
      @IsNotEmpty({ message: notEmptyMessage })
      name: string
    }

    class DummyForm {
      @Expose()
      @IsNotEmpty({ message: notEmptyMessage })
      id: string

      @Expose()
      @ValidateNested()
      @Type(() => DummyChild)
      child: DummyChild
    }

    it('should call next when there are no validation errors', async () => {
      const next = jest.fn()
      const req = {
        body: {
          id: 'abc',
          child: { name: 'def' },
        },
      } as Request
      const res = { redirect: jest.fn() } as unknown as Response
      await validationMiddleware(DummyForm)(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should return flash responses', async () => {
      const next = jest.fn()
      const req = {
        flash: jest.fn(),
        body: {
          id: '',
          child: { name: 'def' },
        },
      } as unknown as Request
      const res = { redirect: jest.fn() } as unknown as Response
      await validationMiddleware(DummyForm)(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('formErrors', JSON.stringify([{ field: 'id', message: notEmptyMessage }]))
      expect(req.flash).toHaveBeenCalledWith('formResponse', JSON.stringify(req.body))
    })

    it('should return the top level property on the error messages', async () => {
      const next = jest.fn()
      const req = {
        flash: jest.fn(),
        body: {
          id: 'abc',
          child: { name: '' },
        },
      } as unknown as Request
      const res = { redirect: jest.fn() } as unknown as Response
      await validationMiddleware(DummyForm)(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith(
        'formErrors',
        JSON.stringify([{ field: 'child', message: notEmptyMessage }])
      )
    })

    it('should should use provided redirect function on error', async () => {
      const next = jest.fn()
      const req = {
        flash: jest.fn(),
        body: {
          id: 'abc',
          child: { name: '' },
        },
      } as unknown as Request
      const res = { redirect: jest.fn() } as unknown as Response
      const redirect = jest.fn()
      await validationMiddleware(DummyForm, redirect)(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith(req, res)
    })
  })
})
