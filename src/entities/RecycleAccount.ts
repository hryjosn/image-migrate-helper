import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm'
import { User } from './User'
import type {Relation} from 'typeorm'

@Entity('recycle_account')
export class RecycleAccount extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @OneToOne(() => User, (user) => user.isWaitingDelete, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
      user: Relation<User>

    @Column()
      delete_time: Date
}
