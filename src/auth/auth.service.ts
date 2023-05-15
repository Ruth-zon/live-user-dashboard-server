import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('user not found');
    const auth = this.authRepository.create({ user: user.id });
    if (!user.password || !user.validatePassword(password)) {
      throw new UnauthorizedException();
    }
    user.loginsCount++;
    user.lastLogin = new Date();
    await user.save();
    await auth.save();
    return { access_token: auth.token };
  }
}
