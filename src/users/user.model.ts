import { User } from '../entities/User'
import { ISignUp, IUpdateUserData } from './types'
import { Guest } from '../entities/Guest'
import GuestModel from '../guest/guest.model'
import { RecycleAccount } from '../entities/RecycleAccount'
import { In } from 'typeorm'

const { findOneByUserName } = new GuestModel()
export default class UserModel {
  async save (params: ISignUp) {
    const { legalName, userName, email, introduction } = params
    const guest = await findOneByUserName(userName) as Guest
    const newUser = new User()
    newUser.legal_name = legalName
    newUser.email = email
    newUser.password = guest.password!
    newUser.user_name = guest.user_name
    newUser.avatar = guest.avatar
    newUser.phone_number = guest.phone_number
    newUser.introduction = introduction
    return await newUser.save()
  }

  updateUserData (params: IUpdateUserData) {
    const { avatar,  id } = params

    return User.createQueryBuilder().update({
      avatar,
    }).where({ id }).returning('*').execute()
  }

  updateUserName (id: string, userName: string) {
    return User.createQueryBuilder().update({
      user_name: userName
    }).where({ id }).returning('*').execute()
  }

  findOneByEmail (email: string) {
    return User.findOne({
      where: { email }
    })
  }
  find(){
    return User.find()
  }
  findOneById (id: string) {
    return User.findOneBy({ id })
  }

  findOneByUserName (userName: string) {
    return User.findOneBy({ user_name: userName })
  }

  getAllUserAmount () {
    return User.count()
  }

  async findPendingDelete (userId:string) {
    return RecycleAccount.createQueryBuilder('recycleAccount')
      .leftJoin('recycleAccount.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne()
  }

  async removePendingDelete (id:string) {
    return RecycleAccount.createQueryBuilder('recycleAccount')
      .where('id = :id', { id })
      .delete()
      .execute()
  }

  async deleteRequest (params: { user: User, deleteTime: Date }) {
    const { user, deleteTime } = params
    const newDeleteRequest = new RecycleAccount()
    newDeleteRequest.user = user
    newDeleteRequest.delete_time = deleteTime
    return await newDeleteRequest.save()
  }

  async findExpiredDeleteTimeUsers (currentTime: Date) {
    return User.createQueryBuilder('user')
      .leftJoinAndSelect('user.isWaitingDelete', 'delete')
      .where('delete.id IS NOT null AND delete.delete_time <= :currentTime', { currentTime })
      .select(['user.user_name'])
      .getMany()
  }

  async deleteUsers (users: string[]) {
    Guest.delete({ user_name: In(users) })
    return User.delete({ user_name: In(users) })
  }

  async findUserByKeyword (keyword: string) {
    return User.createQueryBuilder('user')
      .where('user.user_name like :keyword', { keyword: `%${keyword}%` })
      .getMany()
  }
}
