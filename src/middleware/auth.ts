import { Request, Response, NextFunction } from 'express'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import UserModel from '../users/user.model'

const { findOneById } = new UserModel()

const auth = async (req: Request, res:Response, next:NextFunction) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1]
    const decoded = jwt.verify(token!, process.env.TOKEN!) as JwtPayload
    const userId = decoded._id
    const user = await findOneById(userId)

    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'No permission to request'
      })
    } else {
      req.body.userId = userId

      next()
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).send({
        status: error.name,
        message: error.message
      })
    }
    return res.status(500).send({
      status: 'error',
      message: error
    })
  }
}

export default auth
