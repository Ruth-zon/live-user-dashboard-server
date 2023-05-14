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
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
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
    delete user.password;
    return user;
  }
}
