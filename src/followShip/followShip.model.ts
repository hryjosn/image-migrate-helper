import { User } from '../entities/User'
import { FollowShip } from '../entities/FollowShip'

export default class FollowShipModel {
  async newFollow (params: {followedData: User, followerData: User}) {
    const { followedData, followerData } = params
    const newFollowShip = new FollowShip()
    newFollowShip.followed = followedData
    newFollowShip.follower = followerData
    return newFollowShip.save()
  }

  async checkFollowPermission (params: {targetUserName: string, userId: string}) {
    const { targetUserName, userId } = params
    return FollowShip.findOne({
      relations: {
        followed: true,
        follower: true
      },
      where: { follower: { id: userId }, followed: { user_name: targetUserName } }
    })
  }

  async findFollowingListByUserName (userName:string) {
    const user = await FollowShip.findAndCount({
      relations: {
        followed: true
      },
      where: { follower: { user_name: userName } },
      select: { id: true, created_at: true, followed: { legal_name: true, id: true, user_name: true, avatar: true } }
    })
    return user
  }

  async findFollowerListByUserName (userName:string) {
    const followShip = await FollowShip.findAndCount({
      relations: {
        follower: true
      },
      where: { followed: { user_name: userName } },
      select: { id: true, created_at: true, follower: { legal_name: true, user_name: true, avatar: true } }
    })
    return followShip
  }

  async getFollowerAmount (userName: string) {
    return await FollowShip.count({
      where: { followed: { user_name: userName } }
    })
  }

  async getFollowingAmount (userName: string) {
    return await FollowShip.count({
      where: { follower: { user_name: userName } }
    })
  }

  async deleteFollowShip (followShipId: string) {
    return await FollowShip.delete({ id: followShipId })
  }
}
