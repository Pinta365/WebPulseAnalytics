// deno-lint-ignore-file no-explicit-any
import { Db, InsertOneResult, MongoClient, ObjectId } from "mongodb";
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

export async function getAnalytics(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    total: boolean = false,
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };

    const groupStage = {
        $group: {
            _id: "$projectId",
            uniqueDevices: { $addToSet: "$deviceId" },
            clicks: { $sum: "$clicks" },
            scrolls: { $sum: "$scrolls" },
            uniqueSessions: { $addToSet: "$_id" },
            pageLoads: { $sum: "$loads" },
        },
    };

    const lookupDevicesStage = {
        $lookup: {
            from: "devices",
            localField: "uniqueDevices",
            foreignField: "_id",
            as: "devices",
        },
    };

    const lookupProjectsStage = {
        $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "_id",
            as: "project",
        },
    };

    const projectStage = {
        $project: {
            projectName: { $arrayElemAt: ["$project.name", 0] },
            visitors: { $size: "$uniqueDevices" },
            clicks: 1,
            scrolls: 1,
            sessions: { $size: "$uniqueSessions" },
            pageLoads: 1,
        },
    };

    const sortStage = {
        $sort: {
            visitors: -1,
            sessions: -1,
            pageLoads: -1,
        },
    };

    const totalStage = {
        $group: {
            _id: null,
            visitors: { $sum: "$visitors" },
            clicks: { $sum: "$clicks" },
            scrolls: { $sum: "$scrolls" },
            sessions: { $sum: "$sessions" },
            pageLoads: { $sum: "$pageLoads" },
        },
    };

    const pipeline: any[] = [matchStage, groupStage, lookupDevicesStage, lookupProjectsStage, projectStage, sortStage];
    if (total) {
        pipeline.push(totalStage);
    }

    const results = await sessionsCollection.aggregate(pipeline).toArray();

    return results;
}

export async function getCountries(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
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
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
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
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
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
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
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

export async function getPagesVisited(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
): Promise<any> {
    const database = await getDatabase();
    const eventsCollection = database.collection("events");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            type: "pageLoad",
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };
    const groupStage = {
        $group: {
            _id: { url: "$url", title: "$title" },
            count: { $sum: 1 },
        },
    };
    const sortStage = { $sort: { count: -1 } };
    const pipeline = [matchStage, groupStage, sortStage];
    const results = await eventsCollection.aggregate(pipeline).toArray();
    return results;
}

export async function getTrendsData(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    granularity: "day" | "week" | "month" = "day",
): Promise<any[]> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");

    const matchStage = {
        $match: {
            projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
            timestamp: { $gte: startDate, $lte: endDate },
        },
    };
    const addFieldsStage = {
        $addFields: {
            period: {
                $dateTrunc: {
                    date: { $toDate: "$timestamp" },
                    unit: granularity,
                },
            },
        },
    };
    const groupStage = {
        $group: {
            _id: "$period",
            visitors: { $addToSet: "$deviceId" },
            sessions: { $addToSet: "$_id" },
            pageLoads: { $sum: "$loads" },
            clicks: { $sum: "$clicks" },
            scrolls: { $sum: "$scrolls" },
        },
    };
    const projectStage = {
        $project: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
            visitors: { $size: "$visitors" },
            sessions: { $size: "$sessions" },
            pageLoads: 1,
            clicks: 1,
            scrolls: 1,
            _id: 0,
        },
    };
    const sortStage = { $sort: { date: 1 } };
    const pipeline = [matchStage, addFieldsStage, groupStage, projectStage, sortStage];
    const results = await sessionsCollection.aggregate(pipeline).toArray();
    return results;
}

export async function getPageMetricCounts(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    metric: "clicks" | "scrolls" | "pageLoads",
): Promise<any> {
    const database = await getDatabase();
    const eventsCollection = database.collection("events");

    const eventType = metric === "pageLoads" ? "pageLoad" : metric === "clicks" ? "pageClick" : "pageScroll";

    const matchStage: any = {
        projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
        timestamp: { $gte: startDate, $lte: endDate },
        type: eventType,
    };

    const groupStage = {
        _id: { url: "$url", title: "$title" },
        count: { $sum: 1 },
    };

    const pipeline = [
        { $match: matchStage },
        { $group: groupStage },
        { $sort: { count: -1 } },
    ];
    const results = await eventsCollection.aggregate(pipeline).toArray();
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
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");
    const pipeline = [
        {
            $match: {
                projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
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

export async function getUniqueVisitorsPerLandingPage(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection<SessionObject>("sessions");
    const pipeline = [
        {
            $match: {
                projectId: Array.isArray(projectId) ? { $in: projectId } : projectId,
                timestamp: { $gte: startDate, $lte: endDate },
                pageLoads: { $exists: true, $ne: [] },
            },
        },
        landingPageStage,
        {
            $group: {
                _id: { url: "$landingPage.url", title: "$landingPage.title" },
                uniqueVisitors: { $addToSet: "$deviceId" },
            },
        },
        { $addFields: { seen: { $size: "$uniqueVisitors" } } },
        { $sort: { seen: -1 } },
        // Merge the per-title groups back into one row per url. The visitor sets
        // are unioned rather than added up, so someone who saw the page under two
        // different titles is still counted once.
        {
            $group: {
                _id: "$_id.url",
                visitorSets: { $push: "$uniqueVisitors" },
                title: { $first: "$_id.title" },
            },
        },
        {
            $project: {
                title: 1,
                count: {
                    $size: {
                        $reduce: {
                            input: "$visitorSets",
                            initialValue: [],
                            in: { $setUnion: ["$$value", "$$this"] },
                        },
                    },
                },
            },
        },
        { $sort: { count: -1 } },
        { $project: { _id: { url: "$_id", title: "$title" }, count: 1 } },
    ];
    return await sessionsCollection.aggregate(pipeline).toArray();
}
