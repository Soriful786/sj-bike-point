var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { BookingSource, BookingStatus, MotorcycleType, Role } from '@prisma/client';
import { BookingSlotsService } from '../booking-slots/booking-slots.service.js';
import { generateBookingRef, normalizePhone, normalizeRegistration, } from '../common/utils/identity.js';
import { addDays, isValidDate, istToUtc, TIME_PATTERN } from '../common/utils/time.js';
import { PrismaService } from '../prisma/prisma.service.js';
const S = BookingStatus;
const TRANSITIONS = {
    [S.PENDING]: [S.CONFIRMED, S.CANCELLED],
    [S.CONFIRMED]: [S.CUSTOMER_ARRIVED, S.CANCELLED, S.NO_SHOW],
    [S.CUSTOMER_ARRIVED]: [S.IN_PROGRESS, S.CANCELLED],
    [S.IN_PROGRESS]: [S.COMPLETED, S.CANCELLED],
    [S.COMPLETED]: [],
    [S.CANCELLED]: [],
    [S.NO_SHOW]: [],
};
const CLOSED_STATUSES = [S.COMPLETED, S.CANCELLED, S.NO_SHOW];
const MECHANIC_ALLOWED = [S.IN_PROGRESS, S.COMPLETED];
const OVER_CAPACITY_ROLES = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];
const listInclude = {
    customer: { select: { id: true, name: true, phone: true } },
    motorcycle: { select: { id: true, brand: true, model: true, registrationNumber: true } },
    assignedMechanic: { select: { id: true, name: true } },
    items: true,
};
const detailInclude = {
    customer: { select: { id: true, name: true, phone: true, email: true } },
    motorcycle: true,
    assignedMechanic: { select: { id: true, name: true } },
    items: { orderBy: { createdAt: 'asc' } },
    statusHistory: {
        orderBy: { changedAt: 'asc' },
        include: { changedBy: { select: { name: true } } },
    },
};
let BookingsService = class BookingsService {
    prisma;
    slots;
    constructor(prisma, slots) {
        this.prisma = prisma;
        this.slots = slots;
    }
    async createPublic(dto) {
        const booking = await this.create(dto, BookingSource.ONLINE, false);
        return this.toConfirmation(booking);
    }
    async createByStaff(dto, actor) {
        if (dto.allowOverCapacity && !OVER_CAPACITY_ROLES.includes(actor.role)) {
            throw new ForbiddenException('Only a manager or admin can book beyond capacity');
        }
        const booking = await this.create(dto, BookingSource.ADMIN, !!dto.allowOverCapacity, actor);
        return this.getDetail(booking.id, actor);
    }
    async create(dto, source, allowOverCapacity, actor) {
        if (!isValidDate(dto.date) || !TIME_PATTERN.test(dto.time)) {
            throw new BadRequestException('Please choose a valid date and time');
        }
        const phone = normalizePhone(dto.customer.phone);
        const registration = normalizeRegistration(dto.motorcycle.registrationNumber);
        const serviceIds = [...new Set(dto.serviceIds)];
        const services = await this.prisma.service.findMany({
            where: {
                id: { in: serviceIds },
                isActive: true,
                category: { isActive: true },
                ...(source === BookingSource.ONLINE ? { isOnlineBookable: true } : {}),
            },
        });
        if (services.length !== serviceIds.length) {
            throw new BadRequestException('One or more selected services are not available');
        }
        const totalMinutes = services.reduce((sum, s) => sum + s.estimatedDurationMin, 0);
        const estimatedTotalPaise = services.reduce((sum, s) => sum + s.basePricePaise, 0);
        const mode = source === BookingSource.ONLINE ? 'public' : 'admin';
        return this.prisma.$transaction(async (tx) => {
            const lockKey = `slot:${istToUtc(dto.date, dto.time).toISOString()}`;
            await tx.$executeRaw `SELECT pg_advisory_xact_lock(hashtext(${lockKey}::text))`;
            const slot = await this.slots.inspectSlot(tx, dto.date, dto.time, mode);
            const isFull = slot.used >= slot.capacity;
            if (isFull && !allowOverCapacity) {
                throw new ConflictException('This time slot is full. Please choose another time.');
            }
            let customer = await tx.customer.findUnique({ where: { phone } });
            if (!customer) {
                customer = await tx.customer.create({
                    data: {
                        name: dto.customer.name.trim(),
                        phone,
                        email: dto.customer.email?.toLowerCase(),
                    },
                });
            }
            let bike = await tx.motorcycle.findUnique({
                where: { registrationNumber: registration },
            });
            if (bike && bike.customerId !== customer.id) {
                if (source === BookingSource.ONLINE) {
                    throw new ConflictException('This registration number is linked to a different phone number. Please call the garage to book.');
                }
                bike = await tx.motorcycle.update({
                    where: { id: bike.id },
                    data: { customerId: customer.id },
                });
            }
            if (!bike) {
                bike = await tx.motorcycle.create({
                    data: {
                        customerId: customer.id,
                        brand: dto.motorcycle.brand.trim(),
                        model: dto.motorcycle.model.trim(),
                        registrationNumber: registration,
                        type: dto.motorcycle.type ?? MotorcycleType.COMMUTER,
                        manufacturingYear: dto.motorcycle.manufacturingYear,
                    },
                });
            }
            let bookingRef = generateBookingRef();
            for (let i = 0; i < 5; i++) {
                const clash = await tx.booking.findUnique({ where: { bookingRef } });
                if (!clash)
                    break;
                bookingRef = generateBookingRef();
            }
            const historyNote = isFull
                ? 'Created over capacity by staff'
                : source === BookingSource.ADMIN
                    ? 'Created by staff'
                    : 'Booked online';
            return tx.booking.create({
                data: {
                    bookingRef,
                    customerId: customer.id,
                    motorcycleId: bike.id,
                    scheduledStart: slot.startsAt,
                    scheduledEnd: new Date(slot.startsAt.getTime() + totalMinutes * 60_000),
                    status: S.PENDING,
                    source,
                    customerNote: dto.customerNote,
                    internalNote: dto.internalNote,
                    estimatedTotalPaise,
                    items: {
                        create: services.map((s) => ({
                            serviceId: s.id,
                            serviceNameSnapshot: s.name,
                            unitPricePaise: s.basePricePaise,
                            quantity: 1,
                            addedById: actor?.id,
                        })),
                    },
                    statusHistory: {
                        create: { fromStatus: null, toStatus: S.PENDING, changedById: actor?.id, note: historyNote },
                    },
                },
                include: { items: true },
            });
        }, { timeout: 15_000 });
    }
    toConfirmation(b) {
        return {
            bookingRef: b.bookingRef,
            status: b.status,
            scheduledStart: b.scheduledStart,
            scheduledEnd: b.scheduledEnd,
            estimatedTotalPaise: b.estimatedTotalPaise,
            paymentMethod: 'CASH_AT_GARAGE',
            services: b.items.map((i) => ({
                name: i.serviceNameSnapshot,
                pricePaise: i.unitPricePaise,
                quantity: i.quantity,
            })),
        };
    }
    async track(bookingRef, phoneInput) {
        const notFound = new NotFoundException('No booking found for this reference and phone number');
        let phone;
        try {
            phone = normalizePhone(phoneInput);
        }
        catch {
            throw notFound;
        }
        const booking = await this.prisma.booking.findFirst({
            where: { bookingRef, customer: { phone } },
            select: {
                bookingRef: true,
                status: true,
                scheduledStart: true,
                scheduledEnd: true,
                estimatedTotalPaise: true,
                finalTotalPaise: true,
                motorcycle: { select: { brand: true, model: true } },
                items: { select: { serviceNameSnapshot: true, unitPricePaise: true, quantity: true } },
            },
        });
        if (!booking)
            throw notFound;
        return {
            bookingRef: booking.bookingRef,
            status: booking.status,
            scheduledStart: booking.scheduledStart,
            scheduledEnd: booking.scheduledEnd,
            estimatedTotalPaise: booking.estimatedTotalPaise,
            finalTotalPaise: booking.finalTotalPaise,
            paymentMethod: 'CASH_AT_GARAGE',
            motorcycle: booking.motorcycle,
            services: booking.items.map((i) => ({
                name: i.serviceNameSnapshot,
                pricePaise: i.unitPricePaise,
                quantity: i.quantity,
            })),
        };
    }
    async list(query, actor) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            ...(actor.role === Role.MECHANIC ? { assignedMechanicId: actor.id } : {}),
            ...(query.status ? { status: query.status } : {}),
            ...(query.serviceId ? { items: { some: { serviceId: query.serviceId } } } : {}),
        };
        if (query.date) {
            if (!isValidDate(query.date))
                throw new BadRequestException('date must be a real date');
            where.scheduledStart = {
                gte: istToUtc(query.date, '00:00'),
                lt: istToUtc(addDays(query.date, 1), '00:00'),
            };
        }
        if (query.q?.trim()) {
            const q = query.q.trim();
            const digits = q.replace(/\D/g, '');
            const reg = q.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const or = [
                { bookingRef: { contains: q.toUpperCase() } },
                { customer: { name: { contains: q, mode: 'insensitive' } } },
            ];
            if (digits.length >= 3)
                or.push({ customer: { phone: { contains: digits } } });
            if (reg.length >= 3)
                or.push({ motorcycle: { registrationNumber: { contains: reg } } });
            where.OR = or;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.booking.findMany({
                where,
                include: listInclude,
                orderBy: { scheduledStart: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.booking.count({ where }),
        ]);
        return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getDetail(id, actor) {
        const booking = await this.prisma.booking.findUnique({ where: { id }, include: detailInclude });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (actor.role === Role.MECHANIC && booking.assignedMechanicId !== actor.id) {
            throw new NotFoundException('Booking not found');
        }
        return booking;
    }
    async changeStatus(id, dto, actor) {
        const booking = await this.prisma.booking.findUnique({ where: { id }, include: { items: true } });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (actor.role === Role.MECHANIC) {
            if (booking.assignedMechanicId !== actor.id) {
                throw new ForbiddenException('This job is not assigned to you');
            }
            if (!MECHANIC_ALLOWED.includes(dto.status)) {
                throw new ForbiddenException('Mechanics can only start or complete jobs');
            }
        }
        if (!TRANSITIONS[booking.status].includes(dto.status)) {
            throw new BadRequestException(`A booking cannot change from ${booking.status} to ${dto.status}`);
        }
        if (dto.status === S.CANCELLED && !dto.note?.trim()) {
            throw new BadRequestException('Please give a reason for cancelling');
        }
        const finalTotalPaise = dto.status === S.COMPLETED
            ? booking.items.reduce((sum, i) => sum + i.unitPricePaise * i.quantity, 0)
            : undefined;
        return this.prisma.$transaction(async (tx) => {
            const result = await tx.booking.updateMany({
                where: { id, status: booking.status },
                data: { status: dto.status, ...(finalTotalPaise !== undefined ? { finalTotalPaise } : {}) },
            });
            if (result.count === 0) {
                throw new ConflictException('This booking was just changed by someone else. Refresh and retry.');
            }
            await tx.bookingStatusHistory.create({
                data: {
                    bookingId: id,
                    fromStatus: booking.status,
                    toStatus: dto.status,
                    changedById: actor.id,
                    note: dto.note?.trim() || null,
                },
            });
            return tx.booking.findUnique({ where: { id }, include: detailInclude });
        });
    }
    async reschedule(id, dto, actor) {
        if (!isValidDate(dto.date) || !TIME_PATTERN.test(dto.time)) {
            throw new BadRequestException('Please choose a valid date and time');
        }
        if (dto.allowOverCapacity && !OVER_CAPACITY_ROLES.includes(actor.role)) {
            throw new ForbiddenException('Only a manager or admin can book beyond capacity');
        }
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (booking.status !== S.PENDING && booking.status !== S.CONFIRMED) {
            throw new BadRequestException('Only pending or confirmed bookings can be rescheduled');
        }
        const durationMs = booking.scheduledEnd.getTime() - booking.scheduledStart.getTime();
        return this.prisma.$transaction(async (tx) => {
            const lockKey = `slot:${istToUtc(dto.date, dto.time).toISOString()}`;
            await tx.$executeRaw `SELECT pg_advisory_xact_lock(hashtext(${lockKey}::text))`;
            const slot = await this.slots.inspectSlot(tx, dto.date, dto.time, 'admin', id);
            if (slot.used >= slot.capacity && !dto.allowOverCapacity) {
                throw new ConflictException('That time slot is full');
            }
            const fmt = (d) => d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
            await tx.booking.update({
                where: { id },
                data: {
                    scheduledStart: slot.startsAt,
                    scheduledEnd: new Date(slot.startsAt.getTime() + durationMs),
                },
            });
            await tx.bookingStatusHistory.create({
                data: {
                    bookingId: id,
                    fromStatus: booking.status,
                    toStatus: booking.status,
                    changedById: actor.id,
                    note: `Rescheduled from ${fmt(booking.scheduledStart)} to ${fmt(slot.startsAt)}`,
                },
            });
            return tx.booking.findUnique({ where: { id }, include: detailInclude });
        }, { timeout: 15_000 });
    }
    async assignMechanic(id, mechanicId, actor) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new NotFoundException('Booking not found');
        if (CLOSED_STATUSES.includes(booking.status)) {
            throw new BadRequestException('This booking is already closed');
        }
        const mechanic = await this.prisma.user.findFirst({
            where: { id: mechanicId, role: Role.MECHANIC, isActive: true },
            select: { id: true, name: true },
        });
        if (!mechanic)
            throw new BadRequestException('Mechanic not found or not active');
        return this.prisma.$transaction(async (tx) => {
            await tx.booking.update({ where: { id }, data: { assignedMechanicId: mechanic.id } });
            await tx.bookingStatusHistory.create({
                data: {
                    bookingId: id,
                    fromStatus: booking.status,
                    toStatus: booking.status,
                    changedById: actor.id,
                    note: `Assigned to ${mechanic.name}`,
                },
            });
            return tx.booking.findUnique({ where: { id }, include: detailInclude });
        });
    }
};
BookingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        BookingSlotsService])
], BookingsService);
export { BookingsService };
//# sourceMappingURL=bookings.service.js.map