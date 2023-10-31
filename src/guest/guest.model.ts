import { Guest } from '../entities/Guest'
import { IGuestSignUp } from './types'
export default class GuestModel {
  async addOne (params: IGuestSignUp) {
    const { userName, password, introduction, phoneNumber, avatar, verifyPhoto } = params
    const newGuest = new Guest()
    newGuest.user_name = userName
    newGuest.password = password
    newGuest.introduction = introduction
    newGuest.phone_number = phoneNumber
    newGuest.avatar = avatar
    newGuest.verify_photo = verifyPhoto
    newGuest.verify = false
    return await newGuest.save()
  }

  updateGuestVerify (userName:string) {
    return Guest.createQueryBuilder()
      .update({
        verify: true
      })
      .where('user_name = :userName', { userName })
      .updateEntity(true)
      .execute()
  }

  updateGuestAvatar (userId:string, avatar:string) {
    return Guest.createQueryBuilder()
      .update({
        avatar
      })
      .where({ id: userId })
      .returning('*')
      .updateEntity(true)
      .execute()
  }

  async findOne (guestId:string) {
    return Guest.findOneBy({ id: guestId })
  }
  async find () {
    return Guest.find()
  }

  findOneByUserName (userName:string) {
    return Guest.findOneBy({ user_name: userName })
  }

  findGuestList (params: {skip: number, count: number, userId: string}) {
    const { skip, count, userId } = params
    const praisedGuests = Guest.createQueryBuilder('guest')
      .leftJoin('guest.praises', 'praises')
      .leftJoin('praises.user', 'praise_user')
      .where(`guest.verify = false AND praise_user.id = '${userId}'`)
      .select(['guest.id'])
      .getQuery()

    return Guest.createQueryBuilder('guest')
      .where(`guest.verify = false AND guest.id NOT IN (${praisedGuests})`)
      .select(['guest.user_name', 'guest.avatar', 'guest.introduction'])
      .skip(skip)
      .take(count)
      .orderBy('guest.created_at', 'DESC')
      .getManyAndCount()
  }
}
