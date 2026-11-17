import { BookingSlotsService } from './booking-slots.service.js';
import { AvailabilityQuery, CreateSlotOverrideDto, UpdateGarageSettingsDto } from './dto/slots.dto.js';
export declare class PublicAvailabilityController {
    private readonly slots;
    constructor(slots: BookingSlotsService);
    availability(query: AvailabilityQuery): Promise<{
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
    settings(): Promise<{
        openingTime: string;
        closingTime: string;
        slotLengthMin: number;
        weeklyOffDays: number[];
        advanceBookingDays: number;
        timezone: string;
    }>;
}
export declare class GarageSettingsController {
    private readonly slots;
    constructor(slots: BookingSlotsService);
    get(): import("@prisma/client").Prisma.Prisma__GarageSettingsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(dto: UpdateGarageSettingsDto): Promise<{
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
}
export declare class SlotOverridesController {
    private readonly slots;
    constructor(slots: BookingSlotsService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: string | null;
        capacity: number | null;
        isClosed: boolean;
        reason: string | null;
    }[]>;
    create(dto: CreateSlotOverrideDto): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: string | null;
        capacity: number | null;
        isClosed: boolean;
        reason: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
