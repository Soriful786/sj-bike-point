export declare const DATE_PATTERN: RegExp;
export declare const TIME_PATTERN: RegExp;
export declare function todayInIST(now?: Date): string;
export declare function isValidDate(date: string): boolean;
export declare function addDays(date: string, days: number): string;
export declare function weekdayOf(date: string): number;
export declare function istToUtc(date: string, time: string): Date;
export declare function timeToMinutes(time: string): number;
export declare function minutesToTime(minutes: number): string;
