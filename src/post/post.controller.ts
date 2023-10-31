import PostModel from './post.model'
import UserModel from '../users/user.model'
import { Request, Response, Express } from 'express'
import { Post } from '../entities/Post'
import { User } from '../entities/User'
import ReportModel from './report/report.model'
import FollowShipModel from '../followShip/followShip.model'
import BlockUserModel from '../blockUser/blockUser.model'
import { parseImageUrl, uploadFiles } from '../utils/assetHelper'

const {
  addOne,
  findPostByPostId,
  findPostListByUserId,
  findPost,
  findPostByUserId,
  modifyPost,
  deletePost,
  findLikeById,
  createLike,
  deleteLike,
  findPostList,
  findFollowingPostList,
  findLikeMemberByPost
} = new PostModel()
const { findOneById, findOneByUserName } = new UserModel()
const { findReportedPostId } = new ReportModel()
const { listByUser } = new BlockUserModel()
const { findFollowingListByUserName } = new FollowShipModel()
interface IApi {
  (req: Request, res: Response): void;
}

export const createPost:IApi = async (req, res) => {
  try {
    const { userId, content } = req.body

    const files = req.files as {[fieldname: string]: Express.Multer.File[]}

    const { picture } = files

    const result = await uploadFiles([picture[0]])
    const [pictureImageId] = result
    const newPost = await addOne({ userId, picture: parseImageUrl(req, pictureImageId), content })
    if (newPost) {
      return res.status(201).send({
        status: 'ok',
        data: newPost
      })
    }
  } catch (error:any) {
    console.log(error)
    return res.status(500).send(error)
  }
}

export const newLike:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { postId } = req.params
    const post = await findPostByPostId(postId) as Post
    const user = await findOneById(userId) as User
    if (!post) {
      return res.status(403).send({
        status: 'error',
        message: 'Post does not exist'
      })
    }
    const hasLike = await findLikeById({ postId: post.id, userId: user.id })
    if (hasLike) {
      return res.status(403).send({
        status: 'error',
        message: 'This post have been liked!'
      })
    }
    await createLike({ userId: user, postId: post })
    return res.status(200).send({
      status: 'ok',
      message: 'You liked this post!'
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

export const getPostList:IApi = async (req, res) => {
  try {
    const { userId, page, count } = req.body
    const skip = (page - 1) * count

    const reportedDetail = await findReportedPostId(userId)
    const blockUserList = (await listByUser({ userId })).map((item) => item.blocked.id)

    const reportedPostIdList = reportedDetail.map((report) => report.post.id)

    const publicPostList = await findPostList({ userId, reportedPostIdList, skip, count, blockUserList })

    return res.status(200).send({
      status: 'ok',
      data: publicPostList[0],
      total: publicPostList[1]
    })
  } catch (error:any) {
    return res.status(500).send(error)
  }
}

export const getFollowingPostList:IApi = async (req, res) => {
  try {
    const { userId, page, count } = req.body
    const skip = (page - 1) * count
    const user = await findOneById(userId)
    const reportedDetail = await findReportedPostId(userId)
    const blockUserList = (await listByUser({ userId })).map((item) => item.blocked.id)
    const followingUserList = (await findFollowingListByUserName(user!.user_name))[0].map((user) => user.followed.id)

    const reportedPostIdList = reportedDetail.map((report) => report.post.id)

    const followingPostList = await findFollowingPostList({ userId, reportedPostIdList, skip, count, blockUserList, followingUserList })

    return res.status(200).send({
      status: 'ok',
      data: followingPostList![0],
      total: followingPostList![1]
    })
  } catch (error:any) {
    return res.status(500).send(error)
  }
}
export const getPostListByUserId:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const { userId, page, count } = req.body
    const skip = (page - 1) * count

    const userData = await findOneByUserName(userName)

    if (!userData) {
      return res.status(401).send({
        status: 'error',
        message: 'User not found'
      })
    }
    const reportedDetail = await findReportedPostId(userId)
    const reportedPostIdList = reportedDetail.map((report) => report.post.id)

    const postList = await findPostListByUserId({ userId, reportedPostIdList, ownerUserId: userData.id, skip, count })

    if (postList[0].length === 0) {
      return res.status(403).send({
        status: 'error',
        message: 'There is no post in this page'
      })
    }

    return res.status(200).send({
      status: 'ok',
      data: postList[0],
      total: postList[1]
    })
  } catch (error:any) {
    return res.status(500).send(error)
  }
}

export const getPostByPostId:IApi = async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req.body
    const postData = await findPost({ postId, userId })

    if (!postData) {
      return res.status(403).send({
        status: 'error',
        message: 'Post does not exist'
      })
    }
    return res.status(200).send({
      status: 'ok',
      data: postData
    })
  } catch (error:any) {
    return res.status(500).send(error)
  }
}

export const updatePost:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { postId } = req.params
    const files = req.files as {[fieldname: string]: Express.Multer.File[]}

    const { picture } = files
    const result = await uploadFiles([picture[0]])
    const [pictureImageId] = result

    const isPostExist = await findPostByUserId({ userId, postId })
    if (!isPostExist) {
      return res.status(403).send({
        status: 'error',
        message: 'Post does not exist'
      })
    }
    const updateResult = await modifyPost({ ...req.body, picture: parseImageUrl(req, pictureImageId), postId })
    if (updateResult.affected === 0) {
      return res.status(500).send({
        status: 'error',
        message: 'Post update failed'
      })
    }
    return res.status(201).send({
      status: 'ok',
      data: updateResult.raw[0]
    })
  } catch (error:any) {
    return res.status(500).send(error.message)
  }
}

export const removePost:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { postId } = req.params
    const isPostExist = await findPostByUserId({ userId, postId })
    if (!isPostExist) {
      return res.status(403).send({
        status: 'error',
        message: 'Post does not exist'
      })
    }
    await deletePost(postId)
    return res.status(200).send({
      status: 'ok',
      message: 'Delete Post Successful'
    })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const unlike:IApi = async (req, res) => {
  const { userId } = req.body
  const { postId } = req.params
  const likeData = await findLikeById({ postId, userId })
  await deleteLike(likeData!.id)
  res.status(200).send({
    status: 'ok',
    message: 'Unlike Successful'
  })
}

export const getLikeMemberByPostId:IApi = async (req, res) => {
  try {
    const { postId } = req.params
    const { page, count } = req.body
    const skip = (page - 1) * count

    const likeMembers = await findLikeMemberByPost({ postId, skip, count })
    const likeMemberList = likeMembers[0].map((member) => member.user)

    res.status(200).send({
      likeMemberList,
      total: likeMembers[1]
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
