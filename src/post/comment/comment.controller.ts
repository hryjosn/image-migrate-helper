import CommentModel from './comment.model'
import PostModel from '../post.model'
import { Request, Response } from 'express'
import { Post } from '../../entities/Post'

const {
  addOne, findCommentsByPostId, findComment, deleteComment
} = new CommentModel()

const {
  findPostByPostId
} = new PostModel()

interface IApi {
  (req: Request, res: Response): void;
}

export const newComment:IApi = async (req, res) => {
  try {
    const { userId, comment } = req.body
    const { postId } = req.params
    const post = await findPostByPostId(postId) as Post
    if (!post) {
      return res.status(403).send({
        status: 'error',
        message: 'Post does not exist'
      })
    }
    const newComment = await addOne({ userId, comment, post })
    if (newComment) {
      return res.status(201).send({
        status: 'ok',
        data: newComment
      })
    }
  } catch (error:any) {
    return res.status(500).send(error)
  }
}

export const getCommentsByPostId:IApi = async (req, res) => {
  try {
    const { postId } = req.params
    const { page, count } = req.body
    const skip = (page - 1) * count
    const comments = await findCommentsByPostId({ postId, skip, count })
    if (comments) {
      return res.status(201).send({
        status: 'ok',
        data: comments[0],
        total: comments[1]
      })
    }
  } catch (error:any) {
    return res.status(500).send(error)
  }
}

export const removeComment:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { postId, commentId } = req.params
    const comment = await findComment({ postId, commentId, userId })

    if (!comment) {
      return res.status(403).send({
        status: 'error',
        message: 'No permission to delete this comment'
      })
    }
    await deleteComment(commentId)
    return res.status(200).send({
      status: 'ok',
      message: 'Delete comment successful'
    })
  } catch (error:any) {
    return res.status(500).send(error)
  }
}
