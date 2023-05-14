import { AuthGuard } from './../auth/auth.guard';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/:username')
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOne(username);
  }
}
