import { Request, Response, Express } from 'express'
import GuestModel from './guest.model'
import UserModel from '../users/user.model'
import PraiseModel from './Praise.model'
import bcrypt from 'bcrypt'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { parseImageUrl, uploadFiles } from '../utils/assetHelper'

const { findOneById: findUserById, getAllUserAmount } = new UserModel()
const { addOne, findOneByUserName: findGuestByUserName, findGuestList, findOne, updateGuestAvatar, findOneByUserName } = new GuestModel()
const { newPraise, findPraise, getLikeAmount } = new PraiseModel()

interface IApi {
  (req: Request, res: Response): void;
}

export const newGuest: IApi = async (req, res) => {
  try {
    const { userName, password } = req.body
    const files = req.files as {[fieldname: string]: Express.Multer.File[]}

    const { avatar, verifyPhoto } = files

    const isGuestExist = await findGuestByUserName(userName)
    if (isGuestExist) {
      return res.status(403).send({
        status: 'error',
        message: 'This user name already exists!'
      })
    }

    const result = await uploadFiles([avatar[0], verifyPhoto[0]])
    const [avatarImageId, verifyPhotoImageId] = result

    const encryptedPassword = await bcrypt.hash(password, 10)
    const newGuest = await addOne({ ...req.body, avatar: parseImageUrl(req, avatarImageId), verifyPhoto: parseImageUrl(req, verifyPhotoImageId), password: encryptedPassword })

    const token = 'Bearer ' + jwt.sign({ user_name: userName, user_id: newGuest.id }, String(process.env.TOKEN), { expiresIn: '7 day' })
    return res.status(200).send({
      status: 'ok',
      message: `${newGuest.user_name} sign up successful!`,
      token
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

export const checkUpgradeStatus: IApi = async (req, res) => {
  try {
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
    return res.status(200).send({
      status: 'authorized',
      message: `${userName} can upgrade to user now`
    })
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

export const praise: IApi = async (req, res) => {
  try {
    const { userId, isLike } = req.body
    const { userName } = req.params

    const guest = await findGuestByUserName(userName)
    const user = await findUserById(userId)

    if (!guest) {
      return res.status(403).send({
        status: 'error',
        message: 'Guest does not exist'
      })
    }

    if (!user) {
      return res.status(403).send({
        status: 'error',
        message: 'User does not exist'
      })
    }

    const isPraised = await findPraise({ userId: user.id, guestId: guest.id })
    if (isPraised) {
      return res.status(403).send({
        status: 'error',
        message: 'Already praised this User'
      })
    }

    await newPraise({ user, isLike, guest })
    res.status(200).send({
      status: 'ok',
      message: 'Praise successfully'
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

export const getGuestList: IApi = async (req, res) => {
  try {
    const { page, count, userId } = req.body
    const skip = (page - 1) * count
    const guestList = await findGuestList({ skip, count, userId })
    res.status(200).send({
      status: 'ok',
      data: guestList[0],
      total: guestList[1]
    })
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
export const getGuestInfo: IApi = async (req, res) => {
  try {
    const tempToken = req?.headers?.authorization?.split(' ')[1]

    const decoded = jwt.verify(tempToken!, process.env.TOKEN!) as JwtPayload

    const guestInfo = await findOne(decoded.user_id)

    res.status(200).send({
      status: 'ok',
      data: guestInfo
    })
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
export const updateAvatar: IApi = async (req, res) => {
  try {
    const tempToken = req?.headers?.authorization?.split(' ')[1]
    const decoded = jwt.verify(tempToken!, process.env.TOKEN!) as JwtPayload
    const files = req.files as {[fieldname: string]: Express.Multer.File[]}

    const { avatar } = files
    const result = await uploadFiles([avatar[0]])
    const [avatarImageId] = result
    const guestInfo = await updateGuestAvatar(decoded.user_id, parseImageUrl(req, avatarImageId))

    delete guestInfo.raw[0].password
    res.status(200).send({
      status: 'ok',
      data: guestInfo.raw[0]

    })
  } catch (error) {
    console.log('error', error)
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
