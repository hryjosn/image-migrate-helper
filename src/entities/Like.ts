import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Post } from './Post'
import { User } from './User'
import type { Relation } from 'typeorm';

@Entity('likes')
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @ManyToOne(type => Post, (post) => post.like, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
      post: Relation<Post>

    @ManyToOne(() => User, (user) => user.like, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
      user: Relation<User>
}
