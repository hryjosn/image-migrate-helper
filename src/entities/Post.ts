import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { User } from './User'
import { Like } from './Like'
import { ReportPost } from './ReportPost'
import { Comment } from './Comment'
import type { Relation } from 'typeorm';

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @Column('varchar', { length: 200 })
      picture: string

    @Column('varchar', { length: 500 })
      content: string

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
      user: User

    @OneToMany(() => Comment, (comment) => comment.post)
      comments: Comment[]

    @OneToMany(() => ReportPost, (reportPost) => reportPost.post)
      reports: ReportPost[]

    @OneToMany(() => Like, (like) => like.post)
      like: Relation<Like>[]

    @CreateDateColumn()
      created_at: Date

    @UpdateDateColumn()
      updated_at: Date
}
