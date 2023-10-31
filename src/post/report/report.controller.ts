import { Request, Response } from 'express'
import ReportModel from './report.model'
import UserModel from '../../users/user.model'
import PostModel from '../post.model'
const { addOne } = new ReportModel()
const { findOneById: findUserById } = new UserModel()
const { findPostByPostId } = new PostModel()

interface IApi {
    (req: Request, res: Response): void;
  }

export const report:IApi = async (req, res) => {
  try {
    const { postId } = req.params
    const { userId, reportType, content } = req.body
    const user = await findUserById(userId)
    const post = await findPostByPostId(postId)

    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'User does not exist'
      })
    }

    if (!post) {
      return res.status(403).send({
        status: 'error',
        message: 'Post not found'
      })
    }

    await addOne({ user, post, reportType, content })
    return res.status(201).send({
      status: 'ok',
      message: 'Report successfully'
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
