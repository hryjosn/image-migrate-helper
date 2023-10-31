import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm'
import { Post } from './Post'
import { Like } from './Like'
import { FollowShip } from './FollowShip'
import { Comment } from './Comment'
import { Praise } from './Praise'
import { ReportPost } from './ReportPost'
import { RecycleAccount } from './RecycleAccount'
import { BlockUser } from './BlockUser'
import type {Relation} from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @Column('varchar', { length: 30 })
      legal_name: string

    @Column('varchar', { length: 30 })
      email: string

    @Column('varchar', { length: 30, nullable: true })
      user_name: string

    @Column('varchar', { length: 20, nullable: true })
      phone_number: string

    @Column('varchar', { length: 150 })
      avatar: string

    @Column('varchar', { length: 100 })
      password: string

    @Column('varchar', { length: 200, nullable: true })
      introduction: string

    @OneToMany(() => Praise, (Praise) => Praise.user)
      praises: Praise[]

    @OneToMany(() => Post, (post) => post.user)
      posts: Post[]

    @OneToMany(() => Comment, (comment) => comment.user)
      comments: Comment[]

    @OneToMany(() => ReportPost, (reportPost) => reportPost.user)
      reported_post: ReportPost[]

    @OneToMany(() => Like, (like) => like.user)
      like: Relation<Like>[]

    @OneToMany(() => FollowShip, followed => followed.follower)
      followed: FollowShip[]

    @OneToMany(() => FollowShip, follower => follower.followed)
      follower: FollowShip[]

    @OneToMany(() => BlockUser, blocker => blocker.blocked)
      blocker: BlockUser[]

    @OneToMany(() => BlockUser, blocked => blocked.blocker)
      blocked: BlockUser[]

    @OneToOne(() => RecycleAccount, (recycleAccount) => recycleAccount.user)
      isWaitingDelete: RecycleAccount

    @CreateDateColumn()
      created_at: Date

    @UpdateDateColumn()
      updated_at: Date
}
