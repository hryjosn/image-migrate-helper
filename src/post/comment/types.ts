import { Post } from '../../entities/Post'
import { User } from '../../entities/User'

export interface INewComment {
    userId: User,
    comment: string,
    post: Post,
}
