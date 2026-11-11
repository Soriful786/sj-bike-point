import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
interface ClientMeta {
    userAgent?: string;
    ip?: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    private hashToken;
    private issueTokens;
    login(email: string, password: string, meta: ClientMeta): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshExpiresAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(rawToken: string, meta: ClientMeta): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshExpiresAt: Date;
    }>;
    logout(rawToken?: string): Promise<void>;
    me(userId: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        email: string;
        phone: string | null;
    }>;
}
export {};
