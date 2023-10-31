import { Post } from '../entities/Post'
import { User } from '../entities/User'

export interface INewPost {
    userId: User,
    picture: string,
    content: string,
}

export interface IModifyPost {
    postId: string,
    picture: string,
    content?: string,
}

export interface ILikePost {
    postId: Post,
    userId: User,
}
