var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
const REFRESH_TTL_DAYS = 7;
const DUMMY_HASH = hashSync('not-a-real-password', 12);
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    async issueTokens(user, meta) {
        const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '15m' });
        const refreshToken = randomBytes(48).toString('hex');
        const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: this.hashToken(refreshToken),
                expiresAt,
                userAgent: meta.userAgent?.slice(0, 255),
                ip: meta.ip,
            },
        });
        return { accessToken, refreshToken, refreshExpiresAt: expiresAt };
    }
    async login(email, password, meta) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        const passwordOk = await compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !passwordOk || !user.isActive) {
            throw new UnauthorizedException('Invalid email or password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.issueTokens(user, meta);
        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            ...tokens,
        };
    }
    async refresh(rawToken, meta) {
        const record = await this.prisma.refreshToken.findUnique({
            where: { tokenHash: this.hashToken(rawToken) },
            include: { user: true },
        });
        if (!record || record.revokedAt || record.expiresAt < new Date() || !record.user.isActive) {
            throw new UnauthorizedException('Please log in again');
        }
        await this.prisma.refreshToken.update({
            where: { id: record.id },
            data: { revokedAt: new Date() },
        });
        return this.issueTokens(record.user, meta);
    }
    async logout(rawToken) {
        if (!rawToken)
            return;
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash: this.hashToken(rawToken), revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, phone: true },
        });
        if (!user)
            throw new UnauthorizedException();
        return user;
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map