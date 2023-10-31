import { Comment } from '../../entities/Comment'
import { INewComment } from './types'

export default class CommentModel {
  async addOne (params: INewComment) {
    const { userId, comment, post } = params
    const newComment = new Comment()
    newComment.user = userId
    newComment.comment = comment
    newComment.post = post
    return newComment.save()
  }

  async findCommentsByPostId ({ postId, count, skip }: { postId: string, count: number, skip: number }) {
    return await Comment.findAndCount({
      relations: {
        user: true
      },
      where: { post: { id: postId } },
      take: count,
      skip,
      select: { user: { legal_name: true, user_name: true, avatar: true } },
      order: { created_at: 'DESC' }
    })
  }

  async findComment (params:{ postId: string, commentId: string, userId: string }) {
    const { postId, commentId, userId } = params
    return await Comment.findOne({
      relations: {
        user: true,
        post: true
      },
      where: { id: commentId, post: { id: postId }, user: { id: userId } }
    })
  }

  async deleteComment (commentId: string) {
    return await Comment.delete({ id: commentId })
  }
}
