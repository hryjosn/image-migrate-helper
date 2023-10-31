import paramValidation from './param-validation'
import { validate } from 'express-validation'
import express from 'express'
import auth from '../middleware/auth'
import { validation } from '../middleware/validation'

import { getLikeMemberByPostId, createPost, newLike, getPostList, getPostListByUserId, getFollowingPostList, getPostByPostId, updatePost, removePost, unlike } from './post.controller'
import { report } from './report/report.controller'
import { newComment, getCommentsByPostId, removeComment } from './comment/comment.controller'

import { uploadFiles } from '../middleware/file'

const router = express.Router()

router.route('/createPost').post(uploadFiles.fields([{ name: 'picture', maxCount: 1 }]), validation(paramValidation.createPost), auth, createPost)

router.route('/report/:postId')
  .post(validate(paramValidation.reportPost), auth, report)

router.route('/newComment/:postId')
  .post(validate(paramValidation.newComment), auth, newComment)

router.route('/newLike/:postId')
  .post(auth, newLike)

router.route('/getPostListByUserName/:userName')
  .post(validate(paramValidation.pagination), auth, getPostListByUserId)

router.route('/getPostList')
  .post(validate(paramValidation.pagination), auth, getPostList)

router.route('/getPostByPostId/:postId')
  .get(auth, getPostByPostId)
router.route('/getFollowingPostList')
  .post(auth, getFollowingPostList)

router.route('/getCommentsByPostId/:postId')
  .post(validate(paramValidation.pagination), auth, getCommentsByPostId)

router.route('/updatePost/:postId')
  .put(uploadFiles.fields([{ name: 'picture', maxCount: 1 }]), validation(paramValidation.updatePost), auth, updatePost)

router.route('/getLikeMember/:postId')
  .post(validate(paramValidation.pagination), auth, getLikeMemberByPostId)

router.route('/removePost/:postId')
  .delete(auth, removePost)

router.route('/unlike/:postId')
  .delete(auth, unlike)

router.route('/removeComment/:postId/:commentId')
  .delete(auth, removeComment)
export default router
