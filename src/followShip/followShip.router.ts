import express from 'express'
import { followUser, getFollowingListByUserId, getFollowerListByUserId, deleteFollower, unfollow } from './followShip.controller'
import auth from '../middleware/auth'
const router = express.Router()

router.route('/followUser/:userName')
  .post(auth, followUser)

router.route('/getFollowingListByUserId/:userName')
  .get(auth, getFollowingListByUserId)

router.route('/getFollowerListByUserId/:userName')
  .get(auth, getFollowerListByUserId)

router.route('/deleteFollower/:userName')
  .delete(auth, deleteFollower)

router.route('/unfollow/:userName')
  .delete(auth, unfollow)
export default router
