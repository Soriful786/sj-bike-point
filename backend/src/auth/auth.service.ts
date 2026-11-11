import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

const REFRESH_TTL_DAYS = 7;
// Used so a wrong email takes as long to reject as a wrong password.
const DUMMY_HASH = hashSync('not-a-real-password', 12);

interface ClientMeta {
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(user: { id: string; role: string }, meta: ClientMeta) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken), // only the hash is stored
        expiresAt,
        userAgent: meta.userAgent?.slice(0, 255),
        ip: meta.ip,
      },
    });

    return { accessToken, refreshToken, refreshExpiresAt: expiresAt };
  }

  async login(email: string, password: string, meta: ClientMeta) {
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

  async refresh(rawToken: string, meta: ClientMeta) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(rawToken) },
      include: { user: true },
    });

    if (!record || record.revokedAt || record.expiresAt < new Date() || !record.user.isActive) {
      throw new UnauthorizedException('Please log in again');
    }

    // Rotation: the old refresh token can never be used again.
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(record.user, meta);
  }

  async logout(rawToken?: string) {
    if (!rawToken) return;
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, phone: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}