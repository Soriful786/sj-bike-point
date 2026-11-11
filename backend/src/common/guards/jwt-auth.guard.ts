import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import type { RequestWithUser } from '../types/auth-user.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.access_token;
    if (!token) throw new UnauthorizedException('Not logged in');

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; role: any }>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
      request.user = { id: payload.sub, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Session expired');
    }
  }
}