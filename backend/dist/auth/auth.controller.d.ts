import type { Request, Response } from 'express';
import type { RequestWithUser } from '../common/types/auth-user.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    me(req: RequestWithUser): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        email: string;
        phone: string | null;
    }>;
}
