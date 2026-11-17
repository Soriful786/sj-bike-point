var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { addDays, isValidDate, istToUtc, minutesToTime, timeToMinutes, TIME_PATTERN, todayInIST, weekdayOf, } from '../common/utils/time.js';
export const SLOT_BLOCKING_STATUSES = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CUSTOMER_ARRIVED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
];
export function isDayClosed(weeklyOffDays, date, overrides) {
    const wholeDay = overrides.find((o) => !o.startTime);
    if (wholeDay?.isClosed)
        return true;
    const isOffDay = weeklyOffDays.includes(weekdayOf(date));
    const forcedOpen = !!wholeDay && !wholeDay.isClosed;
    return isOffDay && !forcedOpen;
}
export function capacityForSlot(defaultCapacity, overrides, time) {
    const wholeDay = overrides.find((o) => !o.startTime);
    const slotOverride = overrides.find((o) => o.startTime === time);
    let capacity = defaultCapacity;
    if (wholeDay?.capacity != null)
        capacity = wholeDay.capacity;
    if (slotOverride?.capacity != null)
        capacity = slotOverride.capacity;
    if (slotOverride?.isClosed)
        capacity = 0;
    return capacity;
}
let BookingSlotsService = class BookingSlotsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getSettings() {
        return this.prisma.garageSettings.upsert({
            where: { id: 'singleton' },
            update: {},
            create: { id: 'singleton' },
        });
    }
    async getPublicSettings() {
        const s = await this.getSettings();
        return {
            openingTime: s.openingTime,
            closingTime: s.closingTime,
            slotLengthMin: s.slotLengthMin,
            weeklyOffDays: s.weeklyOffDays,
            advanceBookingDays: s.advanceBookingDays,
            timezone: s.timezone,
        };
    }
    async updateSettings(dto) {
        const current = await this.getSettings();
        const opening = timeToMinutes(dto.openingTime ?? current.openingTime);
        const closing = timeToMinutes(dto.closingTime ?? current.closingTime);
        const length = dto.slotLengthMin ?? current.slotLengthMin;
        if (opening >= closing) {
            throw new BadRequestException('Opening time must be before closing time');
        }
        if ((closing - opening) % length !== 0) {
            throw new BadRequestException('Opening hours must divide evenly into slots of the chosen length');
        }
        return this.prisma.garageSettings.update({ where: { id: 'singleton' }, data: dto });
    }
    async getDayAvailability(date) {
        if (!isValidDate(date))
            throw new BadRequestException('date must be a real date (YYYY-MM-DD)');
        const settings = await this.getSettings();
        const today = todayInIST();
        if (date < today)
            throw new BadRequestException('This date is in the past');
        if (date > addDays(today, settings.advanceBookingDays)) {
            throw new BadRequestException(`Bookings can be made up to ${settings.advanceBookingDays} days ahead`);
        }
        const overrides = await this.prisma.slotOverride.findMany({
            where: { date: new Date(`${date}T00:00:00Z`) },
        });
        if (isDayClosed(settings.weeklyOffDays, date, overrides)) {
            const wholeDay = overrides.find((o) => !o.startTime);
            return {
                date,
                isOpen: false,
                reason: wholeDay?.reason ?? 'Garage is closed on this day',
                slots: [],
            };
        }
        const booked = await this.prisma.booking.findMany({
            where: {
                scheduledStart: { gte: istToUtc(date, '00:00'), lt: istToUtc(addDays(date, 1), '00:00') },
                status: { in: SLOT_BLOCKING_STATUSES },
            },
            select: { scheduledStart: true },
        });
        const usedBySlot = new Map();
        for (const b of booked) {
            const key = b.scheduledStart.getTime();
            usedBySlot.set(key, (usedBySlot.get(key) ?? 0) + 1);
        }
        const open = timeToMinutes(settings.openingTime);
        const close = timeToMinutes(settings.closingTime);
        const length = settings.slotLengthMin;
        const now = Date.now();
        const slots = [];
        for (let minute = open; minute + length <= close; minute += length) {
            const time = minutesToTime(minute);
            const startsAt = istToUtc(date, time);
            const capacity = capacityForSlot(settings.capacityPerSlot, overrides, time);
            const used = usedBySlot.get(startsAt.getTime()) ?? 0;
            const remaining = Math.max(0, capacity - used);
            slots.push({
                time,
                startsAt: startsAt.toISOString(),
                remaining,
                available: startsAt.getTime() > now && remaining > 0,
            });
        }
        return { date, isOpen: true, slots };
    }
    async inspectSlot(db, date, time, mode, excludeBookingId) {
        if (!isValidDate(date))
            throw new BadRequestException('date must be a real date (YYYY-MM-DD)');
        if (!TIME_PATTERN.test(time))
            throw new BadRequestException('time must be HH:mm (24-hour)');
        const settings = await db.garageSettings.upsert({
            where: { id: 'singleton' },
            update: {},
            create: { id: 'singleton' },
        });
        const today = todayInIST();
        if (date < today)
            throw new BadRequestException('This date is in the past');
        if (mode === 'public' && date > addDays(today, settings.advanceBookingDays)) {
            throw new BadRequestException(`Bookings can be made up to ${settings.advanceBookingDays} days ahead`);
        }
        const open = timeToMinutes(settings.openingTime);
        const close = timeToMinutes(settings.closingTime);
        const length = settings.slotLengthMin;
        const minute = timeToMinutes(time);
        if (minute < open || minute + length > close || (minute - open) % length !== 0) {
            throw new BadRequestException('That is not a valid appointment time');
        }
        const startsAt = istToUtc(date, time);
        if (mode === 'public' && startsAt.getTime() <= Date.now()) {
            throw new BadRequestException('This time slot has already started');
        }
        const overrides = await db.slotOverride.findMany({
            where: { date: new Date(`${date}T00:00:00Z`) },
        });
        if (isDayClosed(settings.weeklyOffDays, date, overrides)) {
            throw new BadRequestException('The garage is closed on this day');
        }
        const capacity = capacityForSlot(settings.capacityPerSlot, overrides, time);
        const used = await db.booking.count({
            where: {
                scheduledStart: startsAt,
                status: { in: SLOT_BLOCKING_STATUSES },
                ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
            },
        });
        return { startsAt, capacity, used };
    }
    listOverrides() {
        return this.prisma.slotOverride.findMany({
            where: { date: { gte: new Date(`${todayInIST()}T00:00:00Z`) } },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });
    }
    async createOverride(dto) {
        if (!isValidDate(dto.date))
            throw new BadRequestException('date must be a real date');
        if (dto.date < todayInIST())
            throw new BadRequestException('Cannot override a past date');
        if (!dto.isClosed && dto.capacity === undefined) {
            throw new BadRequestException('Provide either isClosed: true or a capacity');
        }
        const date = new Date(`${dto.date}T00:00:00Z`);
        const startTime = dto.startTime ?? null;
        const data = {
            isClosed: dto.isClosed ?? false,
            capacity: dto.capacity ?? null,
            reason: dto.reason ?? null,
        };
        const existing = await this.prisma.slotOverride.findFirst({ where: { date, startTime } });
        if (existing) {
            return this.prisma.slotOverride.update({ where: { id: existing.id }, data });
        }
        return this.prisma.slotOverride.create({ data: { date, startTime, ...data } });
    }
    async removeOverride(id) {
        const found = await this.prisma.slotOverride.findUnique({ where: { id } });
        if (!found)
            throw new NotFoundException('Override not found');
        await this.prisma.slotOverride.delete({ where: { id } });
        return { message: 'Override removed' };
    }
};
BookingSlotsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BookingSlotsService);
export { BookingSlotsService };
//# sourceMappingURL=booking-slots.service.js.map