import { Entity, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import type {Relation} from 'typeorm'
import { User } from './User'

@Entity('followships')
export class FollowShip extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @ManyToOne(() => User, followed => followed.follower, { onDelete: 'CASCADE' })
      followed: Relation<User>

    @ManyToOne(() => User, follower => follower.followed, { onDelete: 'CASCADE' })
      follower: Relation<User>

    @CreateDateColumn()
      created_at: Date
}
