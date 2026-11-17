import { BadRequestException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { todayInIST } from './time.js';

/** Stores Indian mobiles as 10 digits: "+91 98765-43210" becomes "9876543210". */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new BadRequestException('Enter a valid 10-digit Indian mobile number');
  }
  return digits;
}

/** "wb 02 ab-1234" becomes "WB02AB1234". */
export function normalizeRegistration(input: string): string {
  const reg = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (reg.length < 4 || reg.length > 12) {
    throw new BadRequestException('Enter a valid registration number');
  }
  return reg;
}

// No 0/O or 1/I, so references are easy to read out over the phone.
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** e.g. SJB-261117-K7QX (date part is today in India, suffix is random). */
export function generateBookingRef(now: Date = new Date()): string {
  const datePart = todayInIST(now).replace(/-/g, '').slice(2);
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `SJB-${datePart}-${suffix}`;
}