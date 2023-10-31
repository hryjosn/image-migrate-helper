import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm'
import { Post } from './Post'
import { User } from './User'
import type {Relation} from 'typeorm'

@Entity('comments')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @Column('varchar', { length: 1000 })
      comment: string

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
      post: Relation<Post>

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
      user: Relation<User>

    @CreateDateColumn()
      created_at: Date
}
