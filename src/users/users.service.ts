import { ConflictException, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  // private userRepository: Repository<Role>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
}
