import type { Request } from 'express';
import type { Role } from '@prisma/client';
export interface AuthUser {
    id: string;
    role: Role;
}
export type RequestWithUser = Request & {
    user: AuthUser;
};
