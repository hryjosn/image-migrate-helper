import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Praise } from './Praise'
@Entity('guest')
export class Guest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      id: string

    @Column('varchar', { length: 100 })
      password?: string

    @Column('varchar', { length: 30 })
      user_name: string

    @Column('varchar', { length: 150 })
      avatar: string

    @Column('varchar', { length: 150 })
      verify_photo: string

    @Column('varchar', { length: 150 })
      phone_number: string

    @Column('varchar', { length: 8, nullable: true })
      introduction: string

    @OneToMany(() => Praise, (Praise) => Praise.guest)
      praises: Praise[]

    @Column()
      verify: boolean

    @CreateDateColumn()
      created_at: Date

    @UpdateDateColumn()
      updated_at: Date

    toJSON () {
      delete this.password
      return this
    }
}
