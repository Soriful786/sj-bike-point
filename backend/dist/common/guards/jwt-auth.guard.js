var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    jwt;
    config;
    constructor(reflector, jwt, config) {
        this.reflector = reflector;
        this.jwt = jwt;
        this.config = config;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.access_token;
        if (!token)
            throw new UnauthorizedException('Not logged in');
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
            });
            request.user = { id: payload.sub, role: payload.role };
            return true;
        }
        catch {
            throw new UnauthorizedException('Session expired');
        }
    }
};
JwtAuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector,
        JwtService,
        ConfigService])
], JwtAuthGuard);
export { JwtAuthGuard };
//# sourceMappingURL=jwt-auth.guard.js.map