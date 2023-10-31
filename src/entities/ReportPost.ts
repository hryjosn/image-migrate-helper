import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm'
import { Post } from './Post'
import { User } from './User'
import type {Relation} from 'typeorm'

@Entity('report_post')
export class ReportPost extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
      post: Relation<Post>

    @ManyToOne(() => User, (user) => user.reported_post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
      user: Relation<User>

    @Column('varchar')
      report_type: string

    @Column('varchar', { nullable: true })
      content: string

    @CreateDateColumn()
      created_at: Date
}
