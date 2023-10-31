
import express from 'express'
import { getImage } from './image.controller'

const router = express.Router()

router.route('/:id')
  .get(getImage)
export default router
