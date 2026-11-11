var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
const isProd = process.env.NODE_ENV === 'production';
function setAuthCookies(res, tokens) {
    const base = { httpOnly: true, secure: isProd, sameSite: 'lax' };
    res.cookie('access_token', tokens.accessToken, {
        ...base,
        path: '/',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
        ...base,
        path: '/api/v1/auth',
        expires: tokens.refreshExpiresAt,
    });
}
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    async login(dto, req, res) {
        const result = await this.auth.login(dto.email, dto.password, {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });
        setAuthCookies(res, result);
        return { user: result.user };
    }
    async refresh(req, res) {
        const raw = req.cookies?.refresh_token;
        const tokens = await this.auth.refresh(raw ?? '', {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });
        setAuthCookies(res, tokens);
        return { message: 'Session refreshed' };
    }
    async logout(req, res) {
        await this.auth.logout(req.cookies?.refresh_token);
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/api/v1/auth' });
        return { message: 'Logged out' };
    }
    me(req) {
        return this.auth.me(req.user.id);
    }
};
__decorate([
    Public(),
    Throttle({ default: { limit: 5, ttl: 60_000 } }),
    Post('login'),
    HttpCode(200),
    __param(0, Body()),
    __param(1, Req()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Public(),
    Post('refresh'),
    HttpCode(200),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    Public(),
    Post('logout'),
    HttpCode(200),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Get('me'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map