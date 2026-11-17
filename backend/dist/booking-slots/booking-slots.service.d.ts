import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSlotOverrideDto, UpdateGarageSettingsDto } from './dto/slots.dto.js';
export declare const SLOT_BLOCKING_STATUSES: BookingStatus[];
type OverrideLike = {
    startTime: string | null;
    capacity: number | null;
    isClosed: boolean;
};
export declare function isDayClosed(weeklyOffDays: number[], date: string, overrides: OverrideLike[]): boolean;
export declare function capacityForSlot(defaultCapacity: number, overrides: OverrideLike[], time: string): number;
export declare class BookingSlotsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Prisma.Prisma__GarageSettingsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        openingTime: string;
        closingTime: string;
        slotLengthMin: number;
        capacityPerSlot: number;
        weeklyOffDays: number[];
        advanceBookingDays: number;
        timezone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    getPublicSettings(): Promise<{
        openingTime: string;
        closingTime: string;
        slotLengthMin: number;
        weeklyOffDays: number[];
        advanceBookingDays: number;
        timezone: string;
    }>;
    updateSettings(dto: UpdateGarageSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        openingTime: string;
        closingTime: string;
        slotLengthMin: number;
        capacityPerSlot: number;
        weeklyOffDays: number[];
        advanceBookingDays: number;
        timezone: string;
    }>;
    getDayAvailability(date: string): Promise<{
        date: string;
        isOpen: boolean;
        reason: string;
        slots: never[];
    } | {
        date: string;
        isOpen: boolean;
        slots: {
            time: string;
            startsAt: string;
            remaining: number;
            available: boolean;
        }[];
        reason?: undefined;
    }>;
    inspectSlot(db: Prisma.TransactionClient, date: string, time: string, mode: 'public' | 'admin', excludeBookingId?: string): Promise<{
        startsAt: Date;
        capacity: number;
        used: number;
    }>;
    listOverrides(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: string | null;
        capacity: number | null;
        isClosed: boolean;
        reason: string | null;
    }[]>;
    createOverride(dto: CreateSlotOverrideDto): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: string | null;
        capacity: number | null;
        isClosed: boolean;
        reason: string | null;
    }>;
    removeOverride(id: string): Promise<{
        message: string;
    }>;
}
export {};
