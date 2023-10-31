import { Request, Response } from 'express'
import FollowShipModel from './followShip.model'
import UserModel from '../users/user.model'
import { User } from '../entities/User'

const { newFollow, findFollowingListByUserName, findFollowerListByUserName, deleteFollowShip, checkFollowPermission } = new FollowShipModel()
const { findOneByUserName, findOneById } = new UserModel()

interface IApi {
  (req: Request, res: Response): void;
}

export const followUser:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { userName } = req.params
    const followedData = await findOneByUserName(userName) as User
    const followerData = await findOneById(userId) as User

    if (!followedData || !followerData) {
      return res.status(403).send({
        status: 'error',
        message: 'user does not exist'
      })
    }
    const isFollowing = await checkFollowPermission({ targetUserName: followedData.user_name, userId })
    if (isFollowing) {
      return res.status(403).send({
        status: 'error',
        message: `User ${userName} has been following`
      })
    }

    const newFollowRequest = await newFollow({ followedData, followerData })
    if (newFollowRequest) {
      return res.status(201).send({
        status: 'ok',
        message: 'Follow successful'
      })
    }
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const getFollowingListByUserId:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const followingList = await findFollowingListByUserName(userName)
    res.status(201).send({ status: 'ok', followingData: followingList[0].reverse(), followingCount: followingList[1] })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const getFollowerListByUserId:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const followerList = await findFollowerListByUserName(userName)
    res.status(201).send({ status: 'ok', followerData: followerList[0].reverse(), followerCount: followerList[1] })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const deleteFollower:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const { userId } = req.body

    const follower = await findOneByUserName(userName)
    const followed = await findOneById(userId)
    const followData = await checkFollowPermission({ targetUserName: followed!.user_name, userId: follower!.id })

    await deleteFollowShip(followData!.id)
    return res.status(200).send({
      status: 'ok',
      message: 'Remove follower successful'
    })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const unfollow:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const { userId } = req.body
    const followData = await checkFollowPermission({ targetUserName: userName, userId })

    await deleteFollowShip(followData!.id)
    return res.status(200).send({
      status: 'ok',
      message: 'Unfollow successful'
    })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}
