/**
 * Converts a 24-hour time string (HH:mm) to a 12-hour format string (h:mm AM/PM).
 * @param time24 - The time string in 24-hour format (e.g., "08:00", "20:30").
 * @returns The time string in 12-hour format (e.g., "8:00 AM", "8:30 PM").
 */
export const format24to12 = (time24: string): string => {
    if (!time24) return "";

    // Support both HH:mm and HH:mm:ss if necessary, but focus on HH:mm
    const parts = time24.split(':');
    if (parts.length < 2) return time24;

    let [hours, minutes] = parts.map(Number);

    if (isNaN(hours) || isNaN(minutes)) return time24;

    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hours12}:${minutesStr} ${period}`;
};

export function timeStringToCountdown(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);

    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    let ms = targetDate.getTime();
    const now = Date.now();

    // If the time has passed today, schedule for tomorrow
    if (ms < now) {
        targetDate.setDate(targetDate.getDate() + 1);
        ms = targetDate.getTime();
    }

    const countdown = (ms - now) / 1000;

    return countdown;
}

