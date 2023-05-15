import { Auth } from './../auth/auth.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userAgent: string,
    ip: string,
  ): Promise<User> {
    const userData = { ...createUserDto, ip, userAgent };
    // userData.userAgent = req.headers['User-Agent'];
    const user = this.userRepository.create(userData);
    try {
      await user.save();
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`username ${user.username} already exists`);
      }
    }
    delete user.password;
    return user;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async find(): Promise<Array<User>> {
    const list = await await this.authRepository
      .createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user', `auth.expiredTime > now()`)
      .groupBy('user.id')
      .select([
        'user.username, user.lastLogin as "login time", user.updatedAt as "Last update time", user.ip as "user ip"',
      ])
      .execute();
    return list;
  }
}
