import { User } from '../entities/User'
import { Guest } from '../entities/Guest'
import { Praise } from '../entities/Praise'
export default class PraiseModel {
  newPraise (params:{user: User, guest: Guest, isLike: boolean}) {
    const { user, guest, isLike } = params
    const newLike = new Praise()
    newLike.is_like = isLike
    newLike.user = user
    newLike.guest = guest
    return newLike.save()
  }

  findPraise (params: {userId: string, guestId: string}) {
    const { userId, guestId } = params
    return Praise.createQueryBuilder('praise')
      .where('praise.user_id = :userId AND praise.guest_id = :guestId', { userId, guestId })
      .getOne()
  }

  getLikeAmount (guestId: string) {
    return Praise.createQueryBuilder('praise')
      .where('praise.guest_id = :guestId AND is_like = true', { guestId })
      .getCount()
  }
}
