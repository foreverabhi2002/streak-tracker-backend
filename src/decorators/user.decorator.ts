import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtPayload } from 'src/auth/auth.interface';

export const User = createParamDecorator(
  (field: keyof JwtPayload | null = null, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<{ user: JwtPayload } & FastifyRequest>();
    return field ? req.user[field] : req.user;
  },
);
