import { MongoClient, Db, ObjectId } from 'npm:mongodb';
import { logError } from "./debug_logger.ts";
import { config } from "./config.ts";

export interface ProviderProfile {
    name: string; //"Pinta"
    id: number; //19735646
    avatar_url?: string; //"https://avatars.githubusercontent.com/u/19735646?v=4"
}

export type SupportedProviders = "github"; //Add more providers.. google and apple?

export interface DBUser {
    _id?: ObjectId;
    displayName: string;
    avatar?: string;
    primaryProvider?: SupportedProviders;
    providers: {
        [key in SupportedProviders]?: ProviderProfile;
    };
}

export interface ProjectOptions {
    pageLoads: {
        enabled: boolean;
        storeUserAgent: boolean;
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

const mongoClient = new MongoClient(config.mongo.mongoUri!);
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

/*
export interface EventPayload {
    timestamp: number;
    projectId: string;
    type: string;
    pageLoadId: string;
    sessionId: string;
    [key: string]: string | number | undefined;
}

export async function insertEvent(payload: EventPayload) {
    const collection = (await getDatabase()).collection('events');
    const insertedId = (await collection.insertOne(payload)).insertedId.toString();
    console.log(payload.type, insertedId);

    if (payload.type === "pageLoad") {
        const sessionData: EventPayload = {
            type: "pageSession",
            projectId: payload.projectId,
            sessionId: payload.sessionId,
            pageLoadId: payload.pageLoadId,
            timestamp: payload.timestamp,
            firstEventAt: payload.timestamp,
            lastEventAt: payload.timestamp,
        };

        if (payload.userAgent) {
            sessionData.userAgent = payload.userAgent;
        }

        const insertedSessionId = (await collection.insertOne(sessionData)).insertedId.toString();
        console.log(sessionData.type, insertedSessionId);
    }          
}

export async function getEvents(projectId: string): Promise<EventPayload[]> {
    const collection = (await getDatabase()).collection('events');
    const events = await collection.find({ projectId }).toArray();
    return events;
}*/

export async function getProject(projectId: string): Promise<Project> {
    const collection = (await getDatabase()).collection('projects');
    const idObject = new ObjectId(projectId);
    const project = await collection.findOne({ _id: idObject });
    return project;
}

export async function getProjects(userId: string): Promise<Project[]> {
    const collection = (await getDatabase()).collection('projects');
    const projects = await collection.find({ ownerId: userId }).toArray();
    return projects;
}

export async function insertProject(project: Project): Promise<string> {
    const collection = (await getDatabase()).collection('projects');
    const projectReturned = await collection.insertOne(project);
    return projectReturned.insertedId.toString();
}

export async function getProjectConfiguration(projectId: string, origin: string): Promise<false | Project> {
    const project = await getProject(projectId);
    if (!project) return false;
    return project;
}

// User-related functions

export async function getUserFromProviderId(provider: SupportedProviders, id: number): Promise<DBUser | null> {
    try {
        const collection = (await getDatabase()).collection('users');
        const userDoc = await collection.findOne({ [`providers.${provider}.id`]: id });
        return userDoc;
    } catch (error) {
        logError("Error retrieving user", error);
        return null;
    }
}

async function getUser(userId: string): Promise<DBUser | null> {
    try {
        const collection = (await getDatabase()).collection('users');
        const idObject = new ObjectId(userId);
        const userDoc = await collection.findOne({ _id: idObject });
        return userDoc;
    } catch (error) {
        logError("Error retrieving user", error);
        return null;
    }
}

export async function updateUser(userId: string, user: DBUser, provider?: SupportedProviders, providerProfile?: ProviderProfile): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection('users');
        const idObject = new ObjectId(userId);
        if (provider && providerProfile) {
            user.providers = user.providers || {};
            user.providers[provider] = providerProfile;
        }
        await collection.updateOne({ _id: idObject }, { $set: user });
        return true;
    } catch (error) {
        logError("Error updating user", error);
        return false;
    }
}

export async function createUser(user: DBUser, provider?: SupportedProviders, providerProfile?: ProviderProfile): Promise<string | null> {
    try {
        const collection = (await getDatabase()).collection('users');
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

export async function deleteProject(projectId: string): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection('projects');
        const idObject = new ObjectId(projectId);
        const result = await collection.deleteOne({ _id: idObject });

        // Ensure that a document was deleted
        return result.deletedCount === 1;
    } catch (error) {
        logError("Error deleting project", error);
        return false;
    }
}