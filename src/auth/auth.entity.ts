import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'user_id' })
  user: string;

  @Column()
  expiredTime: Date;

  @BeforeInsert()
  async initAuth() {
    this.expiredTime = new Date();
    this.expiredTime.setDate(
      new Date().getTime() + parseInt(process.env.EXPIRED_TOKEN),
    );
  }
}