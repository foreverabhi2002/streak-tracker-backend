import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { JwtPayload } from './auth.interface';

export enum Platform {
  Web = 'web',
  App = 'app',
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest<
      FastifyRequest & {
        user?: JwtPayload;
      }
    >();
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
      throw new HttpException('Invalid bearer token', HttpStatus.BAD_REQUEST);
    }
    const strArr = bearerToken.split(' ');
    if (strArr.length !== 2) {
      throw new HttpException(
        'Invalid bearer token format',
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessToken = strArr[1];
    try {
      const decoded: JwtPayload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        },
      );
      req['user'] = {
        ...decoded,
        accessToken,
      };
    } catch {
      throw new HttpException('JWT_EXPIRED', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
