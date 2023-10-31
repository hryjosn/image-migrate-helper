import paramValidation from './param-validation'
import { validate } from 'express-validation'
import express from 'express'
import auth from '../middleware/auth'
import { newGuest, checkUpgradeStatus, praise, getGuestList, getGuestInfo, updateAvatar } from './guest.controller'
import { uploadFiles } from '../middleware/file'
import { validation } from '../middleware/validation'

const router = express.Router()

router.route('/signUp')
  .post(uploadFiles.fields([{ name: 'avatar', maxCount: 1 }, { name: 'verifyPhoto', maxCount: 1 }]), validation(paramValidation.signUp), newGuest)

router.route('/checkUpgradeStatus')
  .get(checkUpgradeStatus)

router.route('/praise/:userName')
  .post(validate(paramValidation.praise), auth, praise)

router.route('/list')
  .post(validate(paramValidation.pagination), auth, getGuestList)
router.route('/info')
  .get(getGuestInfo)
router.route('/updateAvatar')
  .put(uploadFiles.fields([{ name: 'avatar', maxCount: 1 }]), validation(paramValidation.updateAvatar), updateAvatar)
export default router
