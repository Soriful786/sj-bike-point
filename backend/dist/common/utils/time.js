export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const IST_OFFSET_MINUTES = 330;
export function todayInIST(now = new Date()) {
    return new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000).toISOString().slice(0, 10);
}
export function isValidDate(date) {
    if (!DATE_PATTERN.test(date))
        return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}
export function addDays(date, days) {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}
export function weekdayOf(date) {
    return new Date(`${date}T00:00:00Z`).getUTCDay();
}
export function istToUtc(date, time) {
    return new Date(`${date}T${time}:00+05:30`);
}
export function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}
export function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
//# sourceMappingURL=time.js.map