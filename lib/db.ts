import { MongoClient, Db, ObjectId, UpdateResult, InsertOneResult } from 'npm:mongodb';
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

export async function getProject(userId: string, projectId: string): Promise<Project> {
    const collection = (await getDatabase()).collection('projects');
    const project = await collection.findOne({ _id: new ObjectId(projectId), ownerId: userId });
    return project;
}

export async function getProjects(userId: string): Promise<Project[]> {
    const collection = (await getDatabase()).collection('projects');
    const projects = await collection.find({ ownerId: userId }).toArray();
    return projects;
}

export async function upsertProject(project: Project): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection('projects');

        // If the project doesn't have an _id, MongoDB will automatically insert one
        let idFilter = {};
        if (project._id) {
            idFilter = { _id: new ObjectId(project._id)  };
            // Use the upsert option
            await collection.updateOne(
                idFilter,
                { $set: project }
            );
        } else {
            await collection.insertOne(project);
        }

        return true;
    } catch (error) {
        logError("Error upserting project", error);
        return false;
    }
}

export async function deleteProject(ownerId: string, projectId: string): Promise<boolean> {
    try {
        const collection = (await getDatabase()).collection('projects');
        const filter: {
            _id?: ObjectId | undefined;
            ownerId: string;
        } = {
            ownerId
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
        const collection = (await getDatabase()).collection('users');
        const userDoc = await collection.findOne({ [`providers.${provider}.id`]: id });
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

export async function getAnalytics(
    projectId: ObjectId | ObjectId[],
    startDate: number,
    endDate: number,
    total: boolean = false
  ): Promise<any> {
    const database = await getDatabase();
    const sessionsCollection = database.collection("sessions");
  
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
        from: 'devices',
        localField: 'uniqueDevices',
        foreignField: '_id',
        as: 'devices',
      },
    };
  
    const lookupProjectsStage = {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project',
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
  
    const pipeline = [matchStage, groupStage, lookupDevicesStage, lookupProjectsStage, projectStage, sortStage];
    if (total) {
      pipeline.push(totalStage);
    }
  
    const results = await sessionsCollection.aggregate(pipeline).toArray();
  
    return results;
  }
