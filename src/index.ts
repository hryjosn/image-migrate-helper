

import 'reflect-metadata'

import { DataSource } from 'typeorm'

import { Post } from './entities/Post'
import { User } from './entities/User'
import { FollowShip } from './entities/FollowShip'
import PostModel from './post/post.model'
import UserModel from './users/user.model'
import GuestModel from './guest/guest.model'


import { Like } from './entities/Like'

import { Guest } from './entities/Guest'
import { Praise } from './entities/Praise'
import { ReportPost } from './entities/ReportPost'
import { RecycleAccount } from './entities/RecycleAccount'
import { BlockUser } from './entities/BlockUser'
import { Comment } from './entities/Comment'
import { parseImageUrl, uploadFiles } from './utils/assetHelper'
import sharp from 'sharp'
import axios from 'axios'
console.log(process.env.DB_URL)


const createServer = async () => {
    const appDataSource = new DataSource({
        type: 'postgres',
        name: process.env.DB_USER,
        url: process.env.DB_URL,
        database: process.env.DB,
        password: process.env.DB_PWD,
        port: 7346,
        synchronize: true,
        entities: [Post, User, FollowShip, Like, Guest, Praise, ReportPost, RecycleAccount, BlockUser, Comment],
        extra: {
          max: 1
        }
      })
    
      await appDataSource.initialize()
      console.log('===============Post==================')
      const postModel = new PostModel()
      const postList = await postModel.find()
      for(let index in postList){
        const post = postList[index]
        
        const response = await axios
        .get(post.picture, {
          responseType: 'arraybuffer'
        })
  
        const photo = await sharp(Buffer.from(response.data, 'binary')).resize().toBuffer()
        const imageId = await uploadFiles(photo)
        console.log('new Url>',parseImageUrl(imageId))

        const result = await postModel.modifyPost({postId:post.id,picture:parseImageUrl(imageId)})
        
        console.log('Success: >',result.raw[0].avatar === parseImageUrl(imageId))
        console.log('Success: >',result.raw[0].picture === parseImageUrl(imageId))

      }
      console.log('===============Post End==================')
      console.log('===============User Start==================')

      const userModel = new UserModel()
      const userList = await userModel.find()
      
      for(let index in userList){
        const user = userList[index]
        
        const response = await axios
        .get(user.avatar, {
          responseType: 'arraybuffer'
        })
  
        const photo = await sharp(Buffer.from(response.data, 'binary')).resize().toBuffer()
        const imageId = await uploadFiles(photo)
        console.log('new Url>',parseImageUrl(imageId))
        const result = await userModel.updateUserData({id:user.id,avatar:parseImageUrl(imageId)})
        console.log('Success: >',result.raw[0].avatar ===parseImageUrl(imageId))
      }
      console.log('===============User End==================')
      console.log('===============Guest Start==================')

      const guestModel = new GuestModel()
      const guestList = await guestModel.find()
      for(let index in guestList){
        const guest = guestList[index]
        
        const response = await axios
        .get(guest.avatar, {
          responseType: 'arraybuffer'
        })
  
        const photo = await sharp(Buffer.from(response.data, 'binary')).resize().toBuffer()
        const imageId = await uploadFiles(photo)
        console.log('new Url>',parseImageUrl(imageId))

        const result = await guestModel.updateGuestAvatar(guest.id,parseImageUrl(imageId))
        console.log('Success: >',result.raw[0].avatar ===parseImageUrl(imageId))

      }
      console.log('===============Guest End==================')

      

      
      
  
}

createServer()
