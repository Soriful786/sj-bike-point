import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { Public } from '../common/decorators/public.decorator.js';
import type { RequestWithUser } from '../common/types/auth-user.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

const isProd = process.env.NODE_ENV === 'production';

function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string; refreshExpiresAt: Date },
) {
  const base = { httpOnly: true, secure: isProd, sameSite: 'lax' as const };
  res.cookie('access_token', tokens.accessToken, {
    ...base,
    path: '/',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    ...base,
    path: '/api/v1/auth', // sent only to auth routes
    expires: tokens.refreshExpiresAt,
  });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 tries per minute
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto.email, dto.password, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    setAuthCookies(res, result);
    return { user: result.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.refresh_token;
    const tokens = await this.auth.refresh(raw ?? '', {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    setAuthCookies(res, tokens);
    return { message: 'Session refreshed' };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.cookies?.refresh_token);
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { message: 'Logged out' };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return this.auth.me(req.user.id);
  }
}