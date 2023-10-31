import { Post } from '../../entities/Post'
import { User } from '../../entities/User'

export interface INewReport {
    user: User
    post: Post
    reportType: string
    content: string
}
