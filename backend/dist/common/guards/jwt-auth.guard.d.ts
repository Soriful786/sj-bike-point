import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
export declare class JwtAuthGuard implements CanActivate {
    private readonly reflector;
    private readonly jwt;
    private readonly config;
    constructor(reflector: Reflector, jwt: JwtService, config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
