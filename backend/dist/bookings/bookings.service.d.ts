import { BookingSlotsService } from '../booking-slots/booking-slots.service.js';
import type { AuthUser } from '../common/types/auth-user.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminCreateBookingDto, ChangeStatusDto, ListBookingsQuery, RescheduleDto } from './dto/bookings.dto.js';
export declare class BookingsService {
    private readonly prisma;
    private readonly slots;
    constructor(prisma: PrismaService, slots: BookingSlotsService);
    createPublic(dto: AdminCreateBookingDto): Promise<{
        bookingRef: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        scheduledStart: Date;
        scheduledEnd: Date;
        estimatedTotalPaise: number;
        paymentMethod: string;
        services: {
            name: string;
            pricePaise: number;
            quantity: number;
        }[];
    }>;
    createByStaff(dto: AdminCreateBookingDto, actor: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            email: string | null;
            phone: string;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brand: string;
            model: string;
            registrationNumber: string;
            type: import("@prisma/client").$Enums.MotorcycleType;
            manufacturingYear: number | null;
            chassisNumber: string | null;
        };
        assignedMechanic: {
            id: string;
            name: string;
        } | null;
        items: {
            id: string;
            createdAt: Date;
            serviceId: string | null;
            serviceNameSnapshot: string;
            unitPricePaise: number;
            quantity: number;
            isAdditional: boolean;
            addedById: string | null;
            bookingId: string;
        }[];
        statusHistory: ({
            changedBy: {
                name: string;
            } | null;
        } & {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: import("@prisma/client").$Enums.BookingStatus | null;
            toStatus: import("@prisma/client").$Enums.BookingStatus;
            changedById: string | null;
            bookingId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingRef: string;
        customerId: string;
        motorcycleId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        source: import("@prisma/client").$Enums.BookingSource;
        customerNote: string | null;
        internalNote: string | null;
        assignedMechanicId: string | null;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
    }>;
    private create;
    private toConfirmation;
    track(bookingRef: string, phoneInput: string): Promise<{
        bookingRef: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        scheduledStart: Date;
        scheduledEnd: Date;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
        paymentMethod: string;
        motorcycle: {
            brand: string;
            model: string;
        };
        services: {
            name: string;
            pricePaise: number;
            quantity: number;
        }[];
    }>;
    list(query: ListBookingsQuery, actor: AuthUser): Promise<{
        items: ({
            customer: {
                id: string;
                name: string;
                phone: string;
            };
            motorcycle: {
                id: string;
                brand: string;
                model: string;
                registrationNumber: string;
            };
            assignedMechanic: {
                id: string;
                name: string;
            } | null;
            items: {
                id: string;
                createdAt: Date;
                serviceId: string | null;
                serviceNameSnapshot: string;
                unitPricePaise: number;
                quantity: number;
                isAdditional: boolean;
                addedById: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingRef: string;
            customerId: string;
            motorcycleId: string;
            scheduledStart: Date;
            scheduledEnd: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            source: import("@prisma/client").$Enums.BookingSource;
            customerNote: string | null;
            internalNote: string | null;
            assignedMechanicId: string | null;
            estimatedTotalPaise: number;
            finalTotalPaise: number | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDetail(id: string, actor: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            email: string | null;
            phone: string;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brand: string;
            model: string;
            registrationNumber: string;
            type: import("@prisma/client").$Enums.MotorcycleType;
            manufacturingYear: number | null;
            chassisNumber: string | null;
        };
        assignedMechanic: {
            id: string;
            name: string;
        } | null;
        items: {
            id: string;
            createdAt: Date;
            serviceId: string | null;
            serviceNameSnapshot: string;
            unitPricePaise: number;
            quantity: number;
            isAdditional: boolean;
            addedById: string | null;
            bookingId: string;
        }[];
        statusHistory: ({
            changedBy: {
                name: string;
            } | null;
        } & {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: import("@prisma/client").$Enums.BookingStatus | null;
            toStatus: import("@prisma/client").$Enums.BookingStatus;
            changedById: string | null;
            bookingId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingRef: string;
        customerId: string;
        motorcycleId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        source: import("@prisma/client").$Enums.BookingSource;
        customerNote: string | null;
        internalNote: string | null;
        assignedMechanicId: string | null;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
    }>;
    changeStatus(id: string, dto: ChangeStatusDto, actor: AuthUser): Promise<({
        customer: {
            id: string;
            name: string;
            email: string | null;
            phone: string;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brand: string;
            model: string;
            registrationNumber: string;
            type: import("@prisma/client").$Enums.MotorcycleType;
            manufacturingYear: number | null;
            chassisNumber: string | null;
        };
        assignedMechanic: {
            id: string;
            name: string;
        } | null;
        items: {
            id: string;
            createdAt: Date;
            serviceId: string | null;
            serviceNameSnapshot: string;
            unitPricePaise: number;
            quantity: number;
            isAdditional: boolean;
            addedById: string | null;
            bookingId: string;
        }[];
        statusHistory: ({
            changedBy: {
                name: string;
            } | null;
        } & {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: import("@prisma/client").$Enums.BookingStatus | null;
            toStatus: import("@prisma/client").$Enums.BookingStatus;
            changedById: string | null;
            bookingId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingRef: string;
        customerId: string;
        motorcycleId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        source: import("@prisma/client").$Enums.BookingSource;
        customerNote: string | null;
        internalNote: string | null;
        assignedMechanicId: string | null;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
    }) | null>;
    reschedule(id: string, dto: RescheduleDto, actor: AuthUser): Promise<({
        customer: {
            id: string;
            name: string;
            email: string | null;
            phone: string;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brand: string;
            model: string;
            registrationNumber: string;
            type: import("@prisma/client").$Enums.MotorcycleType;
            manufacturingYear: number | null;
            chassisNumber: string | null;
        };
        assignedMechanic: {
            id: string;
            name: string;
        } | null;
        items: {
            id: string;
            createdAt: Date;
            serviceId: string | null;
            serviceNameSnapshot: string;
            unitPricePaise: number;
            quantity: number;
            isAdditional: boolean;
            addedById: string | null;
            bookingId: string;
        }[];
        statusHistory: ({
            changedBy: {
                name: string;
            } | null;
        } & {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: import("@prisma/client").$Enums.BookingStatus | null;
            toStatus: import("@prisma/client").$Enums.BookingStatus;
            changedById: string | null;
            bookingId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingRef: string;
        customerId: string;
        motorcycleId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        source: import("@prisma/client").$Enums.BookingSource;
        customerNote: string | null;
        internalNote: string | null;
        assignedMechanicId: string | null;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
    }) | null>;
    assignMechanic(id: string, mechanicId: string, actor: AuthUser): Promise<({
        customer: {
            id: string;
            name: string;
            email: string | null;
            phone: string;
        };
        motorcycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brand: string;
            model: string;
            registrationNumber: string;
            type: import("@prisma/client").$Enums.MotorcycleType;
            manufacturingYear: number | null;
            chassisNumber: string | null;
        };
        assignedMechanic: {
            id: string;
            name: string;
        } | null;
        items: {
            id: string;
            createdAt: Date;
            serviceId: string | null;
            serviceNameSnapshot: string;
            unitPricePaise: number;
            quantity: number;
            isAdditional: boolean;
            addedById: string | null;
            bookingId: string;
        }[];
        statusHistory: ({
            changedBy: {
                name: string;
            } | null;
        } & {
            id: string;
            note: string | null;
            changedAt: Date;
            fromStatus: import("@prisma/client").$Enums.BookingStatus | null;
            toStatus: import("@prisma/client").$Enums.BookingStatus;
            changedById: string | null;
            bookingId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingRef: string;
        customerId: string;
        motorcycleId: string;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        source: import("@prisma/client").$Enums.BookingSource;
        customerNote: string | null;
        internalNote: string | null;
        assignedMechanicId: string | null;
        estimatedTotalPaise: number;
        finalTotalPaise: number | null;
    }) | null>;
}
