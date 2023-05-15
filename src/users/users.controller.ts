import { AuthGuard } from './../auth/auth.guard';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Headers('user-agent') userAgent,
    @Headers() all,
    @Ip() ip,
  ): Promise<User> {
    return await this.usersService.create(createUserDto, userAgent, ip);
  }

  @UseGuards(AuthGuard)
  @Get()
  async find(): Promise<Array<User>> {
    return await this.usersService.find();
  }

  @UseGuards(AuthGuard)
  @Get('/:username')
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOne(username);
  }
}
