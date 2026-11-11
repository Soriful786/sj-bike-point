import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { RequestWithUser } from '../types/auth-user.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true; // no restriction

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    if (user?.role === 'SUPER_ADMIN' || required.includes(user?.role)) return true;
    throw new ForbiddenException('You do not have permission to do this');
  }
}