import { User } from 'src/users/user.entity';
import * as crypto from 'crypto';
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
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @Column()
  expiredTime: Date;

  @BeforeInsert()
  async initAuth() {
    this.token = crypto.randomBytes(16).toString('hex');
    this.expiredTime = new Date();
    this.expiredTime.setSeconds(
      new Date().getSeconds() + parseInt(process.env.EXPIRED_TOKEN) * 1000,
    );
  }
}
