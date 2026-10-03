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
