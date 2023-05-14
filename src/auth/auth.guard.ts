import { Auth } from './auth.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.dataSource
        .getRepository(Auth)
        .findOne({ where: { token } });
      if (payload.expiredTime < new Date()) {
        await this.dataSource.getRepository(Auth).delete({ token });
        throw new UnauthorizedException();
      }
      request['user'] = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
