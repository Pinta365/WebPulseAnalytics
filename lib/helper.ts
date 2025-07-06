import { decodeTime, ulid } from "$std/ulid/mod.ts";

/**
 * Generates a ULID string based on the given seed time or the current date and time.
 *
 * @param {number} [seedTime=Date.now()] - The seed time in milliseconds since the UNIX epoch.
 * @returns {string} The generated ULID string.
 */
export function genULID(seedTime: number = Date.now()): string {
    return ulid(seedTime);
}

/**
 * Extracts the time component from a given ULID string.
 *
 * @param {string} id - The ULID string from which to extract the time component.
 * @returns {number} The time component of the ULID, represented in milliseconds since the UNIX epoch.
 */
export function extractTimeFromULID(id: string): number {
    return decodeTime(id);
}

export function getPeriodEnd(startDate: string | number | Date, granularity: "day" | "week" | "month" | "quarter") {
    const start = new Date(startDate);
    let end = new Date(start);
    switch (granularity) {
        case "day":
            // End is the same as start for a single day
            break;
        case "week": {
            // Add 6 days to get the last day of the week
            end.setDate(start.getDate() + 6);
            break;
        }
        case "month": {
            // Set to last day of the month
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            break;
        }
        case "quarter": {
            // Quarters: Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec
            const currentQuarter = Math.floor(start.getMonth() / 3);
            const lastMonthOfQuarter = currentQuarter * 3 + 2;
            end = new Date(start.getFullYear(), lastMonthOfQuarter + 1, 0);
            break;
        }
        default:
            break;
    }
    return end.toLocaleDateString();
}

/**
 * Helper function to conditionally apply classes
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * Helper function to create responsive classes
 */
export function responsiveClass(base: string, responsive: Record<string, string>): string {
    const classes = [base];
    Object.entries(responsive).forEach(([breakpoint, className]) => {
        classes.push(`${breakpoint}:${className}`);
    });
    return classes.join(" ");
}
