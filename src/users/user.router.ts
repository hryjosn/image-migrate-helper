import paramValidation from './param-validation'
import { validate } from 'express-validation'
import { validation } from '../middleware/validation'
import express from 'express'
import auth from '../middleware/auth'
import { uploadFiles } from '../middleware/file'
import { upgradeUser, modifiedUserData, modifiedUserName, login, getUserData, getUserDataByUserId, deleteUserById, recoverAccount, blockUser, searchUser } from './user.controller'

const router = express.Router()

router.route('/upgradeUser')
  .post(validate(paramValidation.upgradeUser), upgradeUser)

router.route('/recoverAccount')
  .post(auth, recoverAccount)

router.route('/modifiedUserData')
  .put(uploadFiles.fields([{ name: 'avatar', maxCount: 1 }]), validation(paramValidation.modifiedUserData), auth, modifiedUserData)

router.route('/modifiedUserName')
  .put(validate(paramValidation.modifiedIdentity), auth, modifiedUserName)

router.route('/login')
  .post(validate(paramValidation.login), login)

router.route('/getUserData')
  .get(auth, getUserData)

router.route('/getUserDataByUserId/:userName')
  .get(auth, getUserDataByUserId)

router.route('/deleteAccount/request')
  .delete(auth, deleteUserById)

router.route('/blockUser')
  .post(auth, blockUser)

router.route('/search/user/:keyword')
  .get(auth, searchUser)

export default router
