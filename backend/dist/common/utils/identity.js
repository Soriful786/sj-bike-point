import { BadRequestException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { todayInIST } from './time.js';
export function normalizePhone(input) {
    let digits = input.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91'))
        digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0'))
        digits = digits.slice(1);
    if (!/^[6-9]\d{9}$/.test(digits)) {
        throw new BadRequestException('Enter a valid 10-digit Indian mobile number');
    }
    return digits;
}
export function normalizeRegistration(input) {
    const reg = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (reg.length < 4 || reg.length > 12) {
        throw new BadRequestException('Enter a valid registration number');
    }
    return reg;
}
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateBookingRef(now = new Date()) {
    const datePart = todayInIST(now).replace(/-/g, '').slice(2);
    let suffix = '';
    for (let i = 0; i < 4; i++)
        suffix += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
    return `SJB-${datePart}-${suffix}`;
}
//# sourceMappingURL=identity.js.map