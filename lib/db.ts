// deno-lint-ignore-file no-explicit-any
import { Db, type Document, InsertOneResult, MongoClient, ObjectId } from "mongodb";
import { logError } from "./debug_logger.ts";
import { getConfig } from "./config.ts";

import type { Browser, Cpu, Device, Engine, Os } from "https://deno.land/std@0.204.0/http/user_agent.ts";

export interface ProviderProfile {
    name: string; //"Pinta"
    id: number; //19735646
    avatar_url?: string; //"https://avatars.githubusercontent.com/u/19735646?v=4"
}

export type SupportedProviders = "github"; //Add more providers.. google and apple?

export interface UserSettings {
    locale?: string; // e.g., "en-US", "en-GB", "sv-SE"
}

export interface DBUser {
    _id?: ObjectId;
    displayName: string;
    avatar?: string;
    primaryProvider?: SupportedProviders;
    providers: {
        [key in SupportedProviders]?: ProviderProfile;
    };
    settings?: UserSettings;
}

export interface ProjectOptions {
    storeUserAgent: boolean;
    storeLocation: boolean;
    storeUTM: boolean;
    pageLoads: {
        enabled: boolean;
    };
    pageClicks: {
        enabled: boolean;
        captureAllClicks: boolean;
    };
    pageScrolls: {
        enabled: boolean;
    };
}

export interface Project {
    _id?: ObjectId;
    ownerId: string;
    name: string;
    description?: string;
    allowedOrigins?: string[];
    options: ProjectOptions;
}

export interface EventPayload {
    // Present on every event
    timestamp: number;
    projectId: ObjectId;
    type: "pageInit" | "pageLoad" | "pageHide" | "pageClick" | "pageScroll";
    pageLoadId: ObjectId;
    deviceId: ObjectId;
    sessionId: ObjectId;

    /**
     * These are session-scoped and normally absent here: the backend only keeps
     * an event's own copy when it differs from the session's (a bot reusing a
     * sessionId, a visitor whose country changed mid-session). Read user agent
     * and location from SessionObject, not from events.
     */
    userAgent?: UserAgentData;
    location?: LocationData;
    utm?: Record<string, string>;

    // Event-type specific — which of these exist depends on `type`:
    url?: string; // pageLoad, pageHide, pageClick, pageScroll
    title?: string; // pageLoad, pageHide
    referrer?: string; // pageLoad
    depth?: number; // pageScroll — percentage, one of 25/50/75/100
    targetTag?: string; // pageClick
    targetId?: string; // pageClick
    targetHref?: string; // pageClick — only present for anchor targets
    targetClass?: string; // pageClick
    x?: number; // pageClick
    y?: number; // pageClick

    [key: string]:
        | string
        | number
        | undefined
        | ObjectId
        | LocationData
        | UserAgentData
        | Record<string, string>;
}

export interface UserAgentData {
    browser: Browser;
    cpu: Cpu;
    device: Device;
    engine: Engine;
    os: Os;
    ua: string;
}
export interface LocationData {
    countryShort: string;
    countryLong: string;
}

interface PageLoad {
    pageLoadId: ObjectId;
    timestamp: number;
    firstEventAt: number;
    lastEventAt: number;
    referrer?: string;
    /** Absent when the entry was created by a click/scroll before its pageLoad. */
    title?: string;
    url?: string;
    clicks: number;
    scrolls: number;
}

export interface SessionObject {
    _id: ObjectId;
    projectId: ObjectId;
    deviceId: ObjectId;
    timestamp: number;
    firstEventAt: number;
    lastEventAt: number;
    userAgent?: UserAgentData;
    location?: LocationData;
    utm?: Record<string, string>;

    loads: number;
    clicks: number;
    scrolls: number;

    pageLoads: PageLoad[];

    /** Bot classification set by the backend at ingest. Absent on legacy sessions. */
    bot?: SessionBot;
}

export type BotCategory = "search" | "ai" | "social" | "seo" | "monitoring" | "automation" | "unknown";

export interface SessionBot {
    isBot: boolean;
    /** Only when isBot */
    name?: string;
    /** Only when isBot */
    category?: BotCategory;
    /** Signals that fired, e.g. ["ua"]; empty for humans */
    reasons: string[];
}

export interface DeviceObject {
    _id: ObjectId;
    projectId: ObjectId;
    firstEventAt: number;
    lastEventAt: number;
    sessionIds: ObjectId[];

    sessions: number;
    loads: number;
    clicks: number;
    scrolls: number;
}

const mongoClient = new MongoClient(getConfig().mongo.mongoUri!);
let mongoDatabase: Db | null = null;

export async function getDatabase(): Promise<Db> {
    if (!mongoDatabase) {
        await mongoClient.connect();
        mongoDatabase = mongoClient.db("WebPulse");
        console.log("Connected to MongoDB");
    }
    return mongoDatabase;
}

export async function disconnect(): Promise<void> {
    await mongoClient.close();
    mongoDatabase = null;
    console.log("MongoDB connection closed.");
}

export async function getProject(userId: string, projectId: string): Promise<Project | null> {
    const collection = (await getDatabase()).collection<Project>("projects");
    const project = await collection.findOne({ _id: new ObjectId(projectId), ownerId: userId });
    return project;
}

export async function getProjects(userId: string): Promise<Project[]> {
    const collection = (await getDatabase()).collection<Project>("projects");
    const projects = await collection.find({ ownerId: userId }).toArray();
    return projects;
}

export async function upsertProject(project: Project): Promise<ObjectId | null> {
    try {
        const collection = (await getDatabase()).collection("projects");

        // If the project doesn't have an _id, MongoDB will automatically insert one
        let id: ObjectId;
        if (project._id) {
            id = new ObjectId(project._id);
            await collection.updateOne(
                { _id: id },
                { $set: project },
            );
        } else {
            const result: InsertOneResult<Document> = await collection.insertOne(project);
            id = result.insertedId as ObjectId;
        }
        return id;
    } catch (error) {
        logError("Error upserting project", error);
        return null;
    }
}

export async function deleteProject(ownerId: string, projectId: string): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection("projects");
        const filter: {
            _id?: ObjectId | undefined;
            ownerId: string;
        } = {
            ownerId,
        };
        if (projectId && projectId !== "undefined") {
            filter._id = new ObjectId(projectId);
        } else {
            filter._id = undefined;
        }

        const result = await collection.deleteOne(filter);

        // Ensure that a document was deleted
        return result.deletedCount === 1;
    } catch (error) {
        logError("Error deleting project", error);
        return false;
    }
}
// User-related functions

export async function getUserFromProviderId(provider: SupportedProviders, id: number): Promise<DBUser | null> {
    try {
        const collection = (await getDatabase()).collection<DBUser>("users");
        const userDoc = await collection.findOne({ [`providers.${provider}.id`]: id });
        return userDoc;
    } catch (error) {
        logError("Error retrieving user", error);
        return null;
    }
}

export async function getUserById(userId: string): Promise<DBUser | null> {
    try {
        const collection = (await getDatabase()).collection<DBUser>("users");
        const userDoc = await collection.findOne({ _id: new ObjectId(userId) });
        return userDoc;
    } catch (error) {
        logError("Error retrieving user by ID", error);
        return null;
    }
}

export async function updateUser(
    userId: string,
    user: Partial<DBUser>,
    provider?: SupportedProviders,
    providerProfile?: ProviderProfile,
): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection("users");
        const idObject = new ObjectId(userId);
        if (provider && providerProfile) {
            user.providers = user.providers || {};
            user.providers[provider] = providerProfile;
        }
        // Only update the settings field if that's all that's present
        if (user.settings && Object.keys(user).length === 1) {
            await collection.updateOne(
                { _id: idObject },
                { $set: { settings: user.settings } },
            );
        } else if (user.settings) {
            await collection.updateOne(
                { _id: idObject },
                { $set: { ...user, settings: user.settings } },
            );
        } else {
            await collection.updateOne({ _id: idObject }, { $set: user });
        }
        return true;
    } catch (error) {
        logError("Error updating user", error);
        return false;
    }
}

export async function createUser(
    user: DBUser,
    provider?: SupportedProviders,
    providerProfile?: ProviderProfile,
): Promise<string | null> {
    try {
        const collection = (await getDatabase()).collection("users");
        if (provider && providerProfile) {
            user.providers = user.providers || {};
            user.providers[provider] = providerProfile;
        }
        const insertResult = await collection.insertOne(user);
        return insertResult.insertedId.toString();
    } catch (error) {
        logError("Error creating user", error);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Bot filtering
//
// The backend classifies sessions at ingest into session.bot (see SessionBot).
// Sessions stored before that have no bot field; for those we fall back to
// matching the stored user agent against BOT_USER_AGENT. Bots that spoof a
// normal browser are not caught by either.
// ---------------------------------------------------------------------------

export type BotMode = "exclude" | "include" | "only";

export const BOT_USER_AGENT =
    /bot\b|bot\/|crawl|spider|slurp|headless|lighthouse|pagespeed|python-|python\/|curl\/|wget|go-http|java\/|axios|node-fetch|phantomjs|puppeteer|playwright|selenium/i;

/**
 * $match fragment selecting sessions by bot status. Uses the backend's
 * bot.isBot where present, and the user agent regex for legacy sessions.
 */
export function botMatch(mode: BotMode): Record<string, unknown> {
    if (mode === "include") return {};
    const isBot = mode === "only";
    return {
        $or: [
            { "bot.isBot": isBot },
            { bot: { $exists: false }, "userAgent.ua": isBot ? BOT_USER_AGENT : { $not: BOT_USER_AGENT } },
        ],
    };
}

export async function getCountries(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    bots: BotMode = "exclude",
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            ...botMatch(bots),
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };

    const groupStage = {
        $group: {
            _id: "$location.countryShort",
            count: { $sum: 1 },
        },
    };

    const sortStage = {
        $sort: {
            count: -1,
        },
    };

    const pipeline = [matchStage, groupStage, sortStage];

    const results = await sessionsCollection.aggregate(pipeline).toArray();

    return results.map((row) => ({
        _id: countryName(row._id),
        countryShort: row._id ?? null,
        count: row.count,
    }));
}

const regionDisplayNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: unknown): string {
    if (typeof code !== "string" || code.length !== 2) return "(unknown)";
    try {
        return regionDisplayNames.of(code.toUpperCase()) ?? code;
    } catch {
        return code;
    }
}

export async function getOperatingSystems(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    bots: BotMode = "exclude",
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            ...botMatch(bots),
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };

    const groupStage = {
        $group: {
            _id: "$userAgent.os.name",
            count: { $sum: 1 },
        },
    };

    const sortStage = {
        $sort: {
            count: -1,
        },
    };

    const pipeline = [matchStage, groupStage, sortStage];

    const results = await sessionsCollection.aggregate(pipeline).toArray();

    return results;
}

export async function getBrowsers(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    bots: BotMode = "exclude",
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            ...botMatch(bots),
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };

    const groupStage = {
        $group: {
            _id: "$userAgent.browser.name",
            count: { $sum: 1 },
        },
    };

    const sortStage = {
        $sort: {
            count: -1,
        },
    };

    const pipeline = [matchStage, groupStage, sortStage];

    const results = await sessionsCollection.aggregate(pipeline).toArray();

    return results;
}
export async function getReferrers(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    bots: BotMode = "exclude",
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            ...botMatch(bots),
            "pageLoads.timestamp": { $gte: startDate, $lte: endDate },
        },
    };

    const unwindStage = {
        $unwind: "$pageLoads",
    };

    const windowStage = {
        $match: {
            "pageLoads.timestamp": { $gte: startDate, $lte: endDate },
        },
    };

    const hostOf = (field: string) => ({
        $arrayElemAt: [
            { $split: [{ $arrayElemAt: [{ $split: [field, "//"] }, 1] }, "/"] },
            0,
        ],
    });

    const addFieldsStage = {
        $addFields: {
            referrerHost: hostOf("$pageLoads.referrer"),
            pageHost: hostOf("$pageLoads.url"),
        },
    };

    // Navigating between two pages of the same site reports the site itself as
    // the referrer. Those are not traffic sources.
    const excludeSelfReferralsStage = {
        $match: {
            $expr: {
                $not: [{
                    $and: [
                        { $gt: ["$referrerHost", null] },
                        { $eq: ["$referrerHost", "$pageHost"] },
                    ],
                }],
            },
        },
    };

    const groupStage = {
        $group: {
            // An empty or absent referrer means the visitor arrived directly.
            _id: { $ifNull: ["$referrerHost", "(direct)"] },
            count: { $sum: 1 },
        },
    };

    const sortStage = {
        $sort: {
            count: -1,
        },
    };

    const pipeline = [
        matchStage,
        unwindStage,
        windowStage,
        addFieldsStage,
        excludeSelfReferralsStage,
        groupStage,
        sortStage,
    ];

    const results = await sessionsCollection.aggregate(pipeline).toArray();

    return results;
}

/**
 * Picks a session's landing page.
 *
 * Not simply pageLoads[0]: an entry is appended to that array by whichever event
 * arrives first, so a click or scroll landing before its own pageLoad creates an
 * entry with no url — 4,568 sessions have one, and they all collapsed into a
 * single "(no url)" row. Taking the earliest entry that actually has a url
 * recovers the real landing page, and also fixes the 189 sessions whose array is
 * not in chronological order. Falls back to the first entry when none has a url.
 */
const landingPageStage = {
    $addFields: {
        landingPage: {
            $let: {
                vars: {
                    withUrl: {
                        $filter: {
                            input: "$pageLoads",
                            as: "p",
                            cond: { $gt: ["$$p.url", null] },
                        },
                    },
                },
                in: {
                    $ifNull: [
                        { $first: { $sortArray: { input: "$$withUrl", sortBy: { timestamp: 1 } } } },
                        { $arrayElemAt: ["$pageLoads", 0] },
                    ],
                },
            },
        },
    },
};

export async function getSessionsPerLandingPage(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    bots: BotMode = "exclude",
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");
    const pipeline = [
        {
            $match: {
                projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
                ...botMatch(bots),
                timestamp: { $gte: startDate, $lte: endDate },
                pageLoads: { $exists: true, $ne: [] },
            },
        },
        landingPageStage,
        // Two-stage grouping so one URL is one row. Grouping by url *and* title
        // splits a page whose title changed into several rows; grouping by url
        // alone loses the title. So: count by url+title, then merge by url and
        // keep whichever title was seen most often.
        {
            $group: {
                _id: { url: "$landingPage.url", title: "$landingPage.title" },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $group: {
                _id: "$_id.url",
                count: { $sum: "$count" },
                title: { $first: "$_id.title" },
            },
        },
        { $sort: { count: -1 } },
        // Restore the shape the dashboard reads: row._id.url / row._id.title
        { $project: { _id: { url: "$_id", title: "$title" }, count: 1 } },
    ];
    return await sessionsCollection.aggregate(pipeline).toArray();
}

// ---------------------------------------------------------------------------
// Dashboard queries (read-only)
//
// Visitors are distinct devices. Pipelines group by device first and then
// count, rather than collecting every device id into one array per group.
// ---------------------------------------------------------------------------

export interface Summary {
    visitors: number;
    sessions: number;
    pageLoads: number;
    clicks: number;
    scrolls: number;
    /** Sessions with at most one page load */
    bounces: number;
    /** Sum of session durations in ms (each capped, see SESSION_DURATION_CAP) */
    duration: number;
}

export interface SeriesPoint {
    visitors: number;
    sessions: number;
    pageLoads: number;
    bounces: number;
    duration: number;
}

export interface SeriesRow extends SeriesPoint {
    projectId?: string;
    bucket: string;
}

export interface ProjectSummary extends Summary {
    projectId: string;
}

export interface CountRow {
    key: string;
    count: number;
}

export interface PageRow {
    url: string;
    title: string;
    count: number;
}

/** A session left open for hours (a tab never closed) should not dominate the average. */
const SESSION_DURATION_CAP = 4 * 60 * 60 * 1000;

const EMPTY_SUMMARY: Summary = {
    visitors: 0,
    sessions: 0,
    pageLoads: 0,
    clicks: 0,
    scrolls: 0,
    bounces: 0,
    duration: 0,
};

function sessionsInRange(projectIds: ObjectId[], from: number, to: number, bots: BotMode) {
    return { $match: { projectId: { $in: projectIds }, timestamp: { $gte: from, $lt: to }, ...botMatch(bots) } };
}

const perSessionSums = {
    sessions: { $sum: 1 },
    pageLoads: { $sum: "$loads" },
    clicks: { $sum: "$clicks" },
    scrolls: { $sum: "$scrolls" },
    bounces: { $sum: { $cond: [{ $lte: ["$loads", 1] }, 1, 0] } },
    duration: {
        $sum: {
            $min: [{ $max: [{ $subtract: ["$lastEventAt", "$firstEventAt"] }, 0] }, SESSION_DURATION_CAP],
        },
    },
};

const rollUpDevices = {
    visitors: { $sum: 1 },
    sessions: { $sum: "$sessions" },
    pageLoads: { $sum: "$pageLoads" },
    clicks: { $sum: "$clicks" },
    scrolls: { $sum: "$scrolls" },
    bounces: { $sum: "$bounces" },
    duration: { $sum: "$duration" },
};

async function sessions() {
    return (await getDatabase()).collection<SessionObject>("sessions");
}

/** Totals for a set of projects over [from, to). */
export async function getSummary(
    projectIds: ObjectId[],
    from: number,
    to: number,
    bots: BotMode = "exclude",
): Promise<Summary> {
    if (projectIds.length === 0) return { ...EMPTY_SUMMARY };
    const [row] = await (await sessions()).aggregate<Summary>([
        sessionsInRange(projectIds, from, to, bots),
        { $group: { _id: "$deviceId", ...perSessionSums } },
        { $group: { _id: null, ...rollUpDevices } },
        { $project: { _id: 0 } },
    ]).toArray();
    return row ?? { ...EMPTY_SUMMARY };
}

/** Totals per project over [from, to). Projects without sessions are absent. */
export async function getProjectSummaries(
    projectIds: ObjectId[],
    from: number,
    to: number,
    bots: BotMode = "exclude",
): Promise<ProjectSummary[]> {
    if (projectIds.length === 0) return [];
    return await (await sessions()).aggregate<ProjectSummary>([
        sessionsInRange(projectIds, from, to, bots),
        { $group: { _id: { projectId: "$projectId", deviceId: "$deviceId" }, ...perSessionSums } },
        { $group: { _id: "$_id.projectId", ...rollUpDevices } },
        {
            $project: {
                _id: 0,
                projectId: { $toString: "$_id" },
                ...Object.fromEntries(Object.keys(rollUpDevices).map((k) => [k, 1])),
            },
        },
    ]).toArray();
}

/**
 * Time series keyed by bucket start (see lib/ranges.ts bucketKey), optionally
 * split per project. Buckets without sessions are absent; callers fill gaps.
 */
export async function getSeries(
    projectIds: ObjectId[],
    from: number,
    to: number,
    unit: "minute" | "hour" | "day" | "week" | "month",
    binSize: number,
    timezone: string,
    perProject = false,
    bots: BotMode = "exclude",
): Promise<SeriesRow[]> {
    if (projectIds.length === 0) return [];
    const bucket = {
        $dateToString: {
            format: "%Y-%m-%dT%H:%M",
            timezone,
            date: {
                $dateTrunc: {
                    date: { $toDate: "$timestamp" },
                    unit,
                    binSize,
                    timezone,
                    ...(unit === "week" ? { startOfWeek: "monday" } : {}),
                },
            },
        },
    };
    const groupKey = perProject ? { projectId: "$projectId", bucket } : { bucket };
    return await (await sessions()).aggregate<SeriesRow>([
        sessionsInRange(projectIds, from, to, bots),
        {
            $group: {
                _id: { ...groupKey, deviceId: "$deviceId" },
                sessions: perSessionSums.sessions,
                pageLoads: perSessionSums.pageLoads,
                bounces: perSessionSums.bounces,
                duration: perSessionSums.duration,
            },
        },
        {
            $group: {
                _id: perProject ? { projectId: "$_id.projectId", bucket: "$_id.bucket" } : "$_id.bucket",
                visitors: { $sum: 1 },
                sessions: { $sum: "$sessions" },
                pageLoads: { $sum: "$pageLoads" },
                bounces: { $sum: "$bounces" },
                duration: { $sum: "$duration" },
            },
        },
        {
            $project: {
                _id: 0,
                ...(perProject
                    ? { projectId: { $toString: "$_id.projectId" }, bucket: "$_id.bucket" }
                    : { bucket: "$_id" }),
                visitors: 1,
                sessions: 1,
                pageLoads: 1,
                bounces: 1,
                duration: 1,
            },
        },
    ]).toArray();
}

/** Distinct devices with any activity since `since`, per project. */
export async function getActiveVisitors(
    projectIds: ObjectId[],
    since: number,
    bots: BotMode = "exclude",
): Promise<Record<string, number>> {
    if (projectIds.length === 0) return {};
    const rows = await (await sessions()).aggregate<{ _id: ObjectId; visitors: number }>([
        { $match: { projectId: { $in: projectIds }, lastEventAt: { $gte: since }, ...botMatch(bots) } },
        { $group: { _id: { projectId: "$projectId", deviceId: "$deviceId" } } },
        { $group: { _id: "$_id.projectId", visitors: { $sum: 1 } } },
    ]).toArray();
    return Object.fromEntries(rows.map((r) => [r._id.toString(), r.visitors]));
}

/** Page views per URL, using each URL's most frequent title. */
export async function getTopPages(
    projectIds: ObjectId[],
    from: number,
    to: number,
    limit = 100,
    bots: BotMode = "exclude",
): Promise<PageRow[]> {
    if (projectIds.length === 0) return [];
    return await (await sessions()).aggregate<PageRow>([
        {
            $match: {
                projectId: { $in: projectIds },
                "pageLoads.timestamp": { $gte: from, $lt: to },
                ...botMatch(bots),
            },
        },
        { $unwind: "$pageLoads" },
        { $match: { "pageLoads.timestamp": { $gte: from, $lt: to }, "pageLoads.url": { $type: "string" } } },
        { $group: { _id: { url: "$pageLoads.url", title: "$pageLoads.title" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $group: { _id: "$_id.url", count: { $sum: "$count" }, title: { $first: "$_id.title" } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, url: "$_id", title: { $ifNull: ["$title", ""] }, count: 1 } },
    ]).toArray();
}

/** Sessions grouped by an arbitrary session field, e.g. "userAgent.device.type". */
export async function getSessionCounts(
    projectIds: ObjectId[],
    from: number,
    to: number,
    field: string,
    fallback = "(unknown)",
    bots: BotMode = "exclude",
): Promise<CountRow[]> {
    if (projectIds.length === 0) return [];
    return await (await sessions()).aggregate<CountRow>([
        sessionsInRange(projectIds, from, to, bots),
        { $group: { _id: { $ifNull: [`$${field}`, fallback] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, key: "$_id", count: 1 } },
    ]).toArray();
}

export interface BotCountRow extends CountRow {
    /** From the backend classification; absent for legacy sessions */
    category?: BotCategory;
}

/**
 * Bot sessions grouped by crawler name. Classified sessions carry bot.name;
 * for legacy sessions the name is derived from the stored user agent.
 */
export async function getBotCounts(projectIds: ObjectId[], from: number, to: number): Promise<BotCountRow[]> {
    if (projectIds.length === 0) return [];
    const groups = await (await sessions()).aggregate<{
        _id: { name?: string; category?: BotCategory; ua?: string | null };
        count: number;
    }>([
        sessionsInRange(projectIds, from, to, "only"),
        {
            $group: {
                _id: {
                    name: "$bot.name",
                    category: "$bot.category",
                    // Only legacy sessions need their user agent to be named.
                    ua: { $cond: [{ $eq: [{ $type: "$bot" }, "missing"] }, "$userAgent.ua", null] },
                },
                count: { $sum: 1 },
            },
        },
    ]).toArray();
    const byName = new Map<string, BotCountRow>();
    for (const { _id, count } of groups) {
        const key = _id.name ?? botName(_id.ua ?? "");
        const row = byName.get(key) ?? { key, count: 0 };
        row.count += count;
        row.category ??= _id.category;
        byName.set(key, row);
    }
    return [...byName.values()].sort((a, b) => b.count - a.count);
}

/** "Mozilla/5.0 (compatible; Googlebot/2.1; ...)" -> "Googlebot" */
export function botName(ua: string): string {
    // Well-behaved crawlers name themselves in a "compatible; Name/1.0" token.
    const compatible = ua.match(/compatible;\s*([A-Za-z][\w.-]*)/i)?.[1];
    if (compatible && !/^MSIE$/i.test(compatible)) return compatible;
    // "Sogou web spider/4.0" -> "Sogou spider"
    const webSpider = ua.match(/^(\w+) web spider/i)?.[1];
    if (webSpider) return `${webSpider} spider`;
    // Otherwise a product token that calls itself a bot/crawler/spider.
    const token = ua.match(/[A-Za-z][\w.-]*?(?:bot|crawler|spider)[\w-]*/i)?.[0];
    if (token) return token.replace(/[-_.]$/, "");
    if (/headless/i.test(ua)) return ua.match(/Headless\w+/i)?.[0] ?? "Headless browser";
    const lib = ua.match(
        /(python-requests|python-urllib|aiohttp|curl|wget|go-http-client|axios|node-fetch|java|lighthouse|pagespeed|puppeteer|playwright|selenium|phantomjs)/i,
    )?.[0];
    return lib ?? "Other automated";
}
