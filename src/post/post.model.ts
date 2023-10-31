// import appDataSource from '..'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import { INewPost, IModifyPost, ILikePost } from './types'
import { Like } from '../entities/Like'
import { In, Not } from 'typeorm'

export default class PostModel {
  async addOne (params:INewPost) {
    const { userId, picture, content } = params
    const newPost = new Post()
    newPost.user = userId
    newPost.picture = picture
    newPost.content = content
    return newPost.save()
  }

  async findPostList (params: {userId:string, reportedPostIdList: string[], skip: number, count: number, blockUserList:string[]}) {
    const { userId, reportedPostIdList, skip, count, blockUserList } = params
    return Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.reports', 'reports')
      .loadRelationCountAndMap('post.has_like', 'post.like', 'has_like', (qb) => qb.where('has_like.user_id = :id', { id: userId }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.like')
      .where({ id: Not(In(reportedPostIdList)), user: { id: Not(In(blockUserList)) } })

      .select(['post', 'user.user_name', 'user.avatar', 'user.legal_name'])
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(count)
      .getManyAndCount()
  }
  async find () {
    
    return Post.createQueryBuilder('post')
      .getMany()
  }

  async findFollowingPostList (params: {userId:string, followingUserList:string[], reportedPostIdList: string[], skip: number, count: number, blockUserList:string[]}) {
    const { userId, reportedPostIdList, skip, count, blockUserList, followingUserList } = params
    return Post.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .loadRelationCountAndMap('post.has_like', 'post.like', 'has_like', (qb) => qb.where('has_like.user_id = :id', { id: userId }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.like')
      .where({ id: Not(In(reportedPostIdList)), user: { id: Not(In(blockUserList)) } })
      .andWhere({ user: { id: In(followingUserList) } })
      .select(['post', 'user.user_name', 'user.avatar', 'user.legal_name'])
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(count)
      .getManyAndCount()
  }

  async findPostListByUserId (params: {userId:string, reportedPostIdList:string[], ownerUserId:string, skip: number, count: number}) {
    const { userId, reportedPostIdList, ownerUserId, skip, count } = params
    return Post.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.reports', 'reports')
      .loadRelationCountAndMap('post.has_like', 'post.like', 'has_like', (qb) => qb.where('has_like.user_id = :id', { id: userId }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.like')
      .select(['post', 'user.user_name', 'user.avatar', 'user.legal_name'])
      .where({ id: Not(In(reportedPostIdList)), user: { id: ownerUserId } })
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(count)
      .getManyAndCount()
  }

  async findPost (params: { userId: string, postId: string }) {
    const { userId, postId } = params
    return Post.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .loadRelationCountAndMap('post.has_like', 'post.like', 'has_like', (qb) => qb.where('has_like.user_id = :id', { id: userId }))
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.like')
      .select(['post', 'user.user_name', 'user.avatar', 'user.legal_name'])
      .where('post.id = :id', { id: postId })
      .getOne()
  }

  async findPostByUserId (params: { userId: string, postId: string }) {
    const { userId, postId } = params
    const user = await User.find({
      relations: {
        posts: true
      },
      where: { id: userId, posts: { id: postId } },
      select: { posts: { id: true } }
    })
    return user[0]?.posts[0]
  }

  async findPostByPostId (postId: string) {
    const post = await Post.findOneBy({ id: postId })
    return post
  }

  modifyPost (params:IModifyPost) {
    const { postId, picture, content } = params
    return Post.createQueryBuilder().update({ picture, content }).where({ id: postId }).returning('*').execute()
  }

  async deletePost (postId: string) {
    return Post.delete({ id: postId })
  }

  async findLikeById (params: { postId: string, userId: string }) {
    const { postId, userId } = params
    const like = await Like.findOne({
      relations: {
        post: true,
        user: true
      },
      where: {
        post: { id: postId },
        user: { id: userId }
      }
    })
    return like
  }

  async findLikeMemberByPost ({ postId, skip, count }: {postId:string, skip: number, count: number}) {
    return Like.createQueryBuilder('like')
      .leftJoin('like.user', 'user')
      .leftJoin('like.post', 'post')
      .select(['like.id', 'user.user_name', 'user.avatar', 'user.legal_name'])
      .where('post.id = :postId', { postId })
      .skip(skip)
      .take(count)
      .limit(100)
      .getManyAndCount()
  }

  async createLike (params: ILikePost) {
    const { userId, postId } = params
    const newLike = new Like()
    newLike.user = userId
    newLike.post = postId
    return newLike.save()
  }

  async deleteLike (likeId: string) {
    return Like.delete({ id: likeId })
  }
}
