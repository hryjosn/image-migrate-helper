
import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export const validation = (schema:ObjectSchema) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const { error } = schema.validate(req)
    const valid = error == null

    if (valid) {
      next()
    } else {
      const { details } = error
      const message = details.map(i => i.message).join(',')
      console.log('message>', message)
      res.status(422).json({ error: message })
    }
  }
}
