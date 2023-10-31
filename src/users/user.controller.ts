import { Request, Response, Express } from 'express'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from './user.model'
import FollowShipModel from '../followShip/followShip.model'
import GuestModel from '../guest/guest.model'
import PraiseModel from '../guest/Praise.model'
import BlockUserModel from '../blockUser/blockUser.model'
import addMonths from 'date-fns/addMonths'
import { parseImageUrl, uploadFiles } from '../utils/assetHelper'

const { updateGuestVerify, findOneByUserName: findGuestByUserName } = new GuestModel()
const { removePendingDelete, findPendingDelete, deleteUsers, findExpiredDeleteTimeUsers, deleteRequest, findOneById, save, updateUserData, findOneByEmail, findOneByUserName: findUserByUserName, updateUserName, getAllUserAmount, findUserByKeyword } = new UserModel()
const { getFollowerAmount, getFollowingAmount, checkFollowPermission } = new FollowShipModel()
const { getLikeAmount } = new PraiseModel()
interface IApi {
  (req: Request, res: Response): void;
}

export const upgradeUser:IApi = async (req, res) => {
  try {
    const { email } = req.body
    const tempToken = req?.headers?.authorization?.split(' ')[1]
    const decoded = jwt.verify(tempToken!, process.env.TOKEN!) as JwtPayload
    const userName = decoded.user_name

    const guest = await findGuestByUserName(userName)

    if (!guest) {
      return res.status(403).send({
        status: 'error',
        message: `${userName} not found`
      })
    }

    if (guest.verify) {
      return res.status(403).send({
        status: 'error',
        message: 'You have been upgraded to User'
      })
    }

    const guestLikes = await getLikeAmount(guest.id)
    const AllUserAmount = await getAllUserAmount()
    if (!(guestLikes >= Math.floor((AllUserAmount / 3)))) {
      return res.status(200).send({
        status: 'pending',
        message: `User's Like does not reach point, current Like Amount: ${guestLikes}`,
        userLikeAmount: guestLikes
      })
    }

    const isEmailExist = await findOneByEmail(email)

    if (isEmailExist) {
      return res.status(400).send({
        status: 'error',
        message: 'This account had been registered'
      })
    }

    const newUser = await save({ ...req.body, userName })
    const token = 'Bearer ' + jwt.sign({ _id: newUser.id }, String(process.env.TOKEN), { expiresIn: '7 day' })
    await updateGuestVerify(userName)
    return res.status(201).send({ status: 'ok', message: 'signUp successful', token })
  } catch (error:any) {
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

export const modifiedUserData:IApi = async (req, res) => {
  try {
    const { userId } = req.body

    const files = req.files as {[fieldname: string]: Express.Multer.File[]}
    const { avatar } = files

    if (!avatar) {
      const updateResult = await updateUserData({ ...req.body, id: userId })

      if (updateResult.affected === 0) {
        return res.status(500).send({
          status: 'error',
          message: 'User update failed'
        })
      }
      delete updateResult.raw[0].password
      return res.status(201).send({
        status: 'ok',
        data: updateResult.raw[0]
      })
    }
    const result = await uploadFiles([avatar[0]])
    const [avatarImageId] = result

    const updateResult = await updateUserData({ ...req.body, id: userId, avatar: parseImageUrl(req, avatarImageId) })

    if (updateResult.affected === 0) {
      return res.status(500).send({
        status: 'error',
        message: 'User update failed'
      })
    }
    delete updateResult.raw[0].password
    return res.status(201).send({
      status: 'ok',
      data: updateResult.raw[0]
    })
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const modifiedUserName:IApi = async (req, res) => {
  try {
    const { userId, userName } = req.body
    const existUser = await findUserByUserName(userName)

    if (!existUser?.id) {
      const updateResult = await updateUserName(userId, userName)
      if (updateResult.affected === 0) {
        return res.status(500).send({
          status: 'error',
          message: 'User update failed'
        })
      }
      delete updateResult.raw[0].password
      return res.status(201).send({
        status: 'ok',
        message: 'Update successful'
      })
    } else {
      return res.status(403).send({
        status: 'error',
        data: 'This user name has been used'
      })
    }
  } catch (error:any) {
    res.status(500).send(error)
    throw error
  }
}

export const login:IApi = async (req: Request, res:Response) => {
  try {
    const { userName, password } = req.body
    if (!userName || !password) {
      return res.status(400).send({
        status: 'error',
        message: 'Please enter whole information'
      })
    }
    const guest = await findGuestByUserName(userName)

    if (!guest) {
      return res.status(403).send({
        status: 'error',
        message: 'User Name or password is not correct'
      })
    }

    const isGuestPasswordCorrect = await bcrypt.compare(password, guest.password!)

    if (!isGuestPasswordCorrect) {
      return res.status(403).send({ status: 'error', message: 'User Name or password is not correct' })
    }

    if (!guest.verify) {
      const guestLikes = await getLikeAmount(guest.id)
      const AllUserAmount = await getAllUserAmount()

      const token = 'Bearer ' + jwt.sign({ user_name: userName, user_id: guest.id }, String(process.env.TOKEN), { expiresIn: '7 day' })

      if (!(guestLikes >= Math.floor((AllUserAmount / 3)))) {
        return res.status(200).send({
          status: 'guest_pending',
          message: `User's Like does not reach point, current Like Amount: ${guestLikes}`,
          userLikeAmount: guestLikes,
          token
        })
      }

      return res.status(200).send({
        status: 'guest_authorized',
        message: `${userName} can upgrade to user now`,
        token
      })
    }

    const userData = await findUserByUserName(userName)

    if (!userData) {
      return res.status(403).send({ status: 'error', message: 'User Name or password is not correct' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password)

    if (!isPasswordCorrect) {
      return res.status(403).send({ status: 'error', message: 'User Name or password is not correct' })
    }
    const isPendingDelete = await findPendingDelete(userData.id)

    const token = 'Bearer ' + jwt.sign({ _id: userData.id }, String(process.env.TOKEN), { expiresIn: '7 day' })

    if (isPendingDelete) {
      return res.status(200).send({
        status: 'deactivated',
        message: 'Account deactivated',
        token
      })
    }

    return res.status(200).send({ status: 'user_login', msg: 'Login successful', token })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: error
    })
  }
}

export const getUserData:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await findOneById(userId)
    const follower = await getFollowerAmount(userData!.user_name)
    const following = await getFollowingAmount(userData!.user_name)
    res.status(200).send({
      status: 'ok',
      data: {
        legalName: userData!.legal_name,
        email: userData!.email,
        userName: userData!.user_name,
        avatar: userData!.avatar,
        phoneNumber: userData!.phone_number,
        introduction: userData!.introduction,
        followerCount: follower,
        followingCount: following
      }
    })
  } catch (error: any) {
    res.status(500).send(error)
    throw error
  }
}

export const getUserDataByUserId:IApi = async (req, res) => {
  try {
    const { userName } = req.params
    const { userId } = req.body
    const userData = await findUserByUserName(userName)
    if (!userData) {
      return res.status(403).send({
        status: 'error',
        message: 'User not found'
      })
    }
    const follower = await getFollowerAmount(userData.user_name)
    const following = await getFollowingAmount(userData.user_name)
    const isFollowing = await checkFollowPermission({ targetUserName: userName, userId })

    res.status(200).send({
      status: 'ok',
      data: {
        legalName: userData!.legal_name,
        email: userData!.email,
        userName: userData!.user_name,
        avatar: userData!.avatar,
        phoneNumber: userData!.phone_number,
        followerCount: follower,
        followingCount: following,
        isFollowing: !!isFollowing
      }
    })
  } catch (error: any) {
    res.status(500).send(error)
    throw error
  }
}

export const recoverAccount:IApi = async (req, res) => {
  const { userId } = req.body
  const userData = await findOneById(userId)
  if (!userData) {
    return res.status(403).send({
      status: 'error',
      message: 'User not found'
    })
  }

  const deleteDetail = await findPendingDelete(userData.id)

  await removePendingDelete(deleteDetail!.id)

  return res.status(200).send({
    status: 'ok',
    message: 'Your account has been restored'
  })
}

export const deleteUserById:IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await findOneById(userId)
    if (!userData) {
      return res.status(403).send({
        status: 'error',
        message: 'User not found'
      })
    }

    const deleteDetail = await findPendingDelete(userData.id)

    if (deleteDetail) {
      return res.status(403).send({
        status: 'error',
        message: 'Delete pending'
      })
    }

    const deleteTime = addMonths(new Date(), 1)
    await deleteRequest({ user: userData, deleteTime })
    return res.status(200).send({
      status: 'ok',
      message: 'Delete request successfully'
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

export const deleteTimeExpired:IApi = async (req, res) => {
  try {
    const currentTime = new Date()
    const expiredList = await findExpiredDeleteTimeUsers(currentTime)
    if (!expiredList) {
      return res.status(200).send({
        status: 'ok',
        message: 'No account has expired'
      })
    }

    const userList = expiredList.map((expired) => expired.user_name)

    await deleteUsers(userList)
    return res.status(200).send({
      status: 'ok',
      message: 'Clean out all expired accounts'
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
export const blockUser:IApi = async (req, res) => {
  try {
    const { userName, userId } = req.body
    const userData = await findUserByUserName(userName)
    if (!userData) {
      return res.status(403).send({
        status: 'error',
        message: 'User not found'
      })
    }
    const blockUserModel = new BlockUserModel()
    const deleteDetail = await blockUserModel.save({ userName, userId })

    if (deleteDetail) {
      return res.status(200).send({
        status: 'ok',
        message: 'Delete request successfully'
      })
    }
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
export const searchUser:IApi = async (req, res) => {
  try {
    const { keyword } = req.params
    const userList = await findUserByKeyword(keyword)
    return res.status(200).send({
      status: 'ok',
      users: userList
    })
    // const blockUserModel = new BlockUserModel()
    // const deleteDetail = await blockUserModel.listByUser({ userId })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
