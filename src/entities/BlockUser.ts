import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from './User'
import type {Relation} from 'typeorm'

@Entity('block_user')
export class BlockUser extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @ManyToOne(() => User, (blocker) => blocker.blocked, { onDelete: 'CASCADE' })
    @JoinColumn()
      blocker: Relation<User>

    @ManyToOne(() => User, (blocked) => blocked.blocker, { onDelete: 'CASCADE' })
    @JoinColumn()
      blocked: Relation<User>

    @CreateDateColumn()
      created_at: Date
}
