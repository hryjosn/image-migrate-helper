import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm'
import { Guest } from './Guest'
import { User } from './User'
import type {Relation} from 'typeorm'

@Entity('praises')
export class Praise extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @ManyToOne(() => User, (user) => user.praises, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
      user: Relation<User>

    @ManyToOne(() => Guest, (guest) => guest.praises)
    @JoinColumn({ name: 'guest_id' })
      guest: Relation<Guest>

    @Column()
      is_like: boolean
}
