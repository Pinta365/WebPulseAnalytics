import { DBUser, Project, ProviderProfile, Realm, SupportedProviders } from "lib/commonTypes.ts";
import { genULID } from "lib/helper.ts";

const database = await Deno.openKv(Deno.env.get("DENO_KV_LOCAL_DATABASE") || undefined);

export { database };

export async function getUserFromProviderId(provider: SupportedProviders, id: number): Promise<DBUser> {
    try {
        const providerLink = await database.get(["users", provider, id]);
        if (providerLink?.value) {
            const user = await getUser(providerLink.value as string);
            return user;
        } else {
            return {} as DBUser;
        }
    } catch (error) {
        console.error(error);
        return {} as DBUser;
    }
}

export async function getUser(userId: string): Promise<DBUser> {
    try {
        const user = await database.get<DBUser>(["users", userId]);
        if (user?.value) {
            return user.value;
        } else {
            return {} as DBUser;
        }
    } catch (error) {
        console.error(error);
        return {} as DBUser;
    }
}

export async function updateUser(
    userId: string,
    user: DBUser,
    provider?: SupportedProviders,
    providerProfile?: ProviderProfile,
) {
    try {
        if (provider && providerProfile) {
            await addOrUpdateProvider(user, provider, providerProfile);
        } else {
            await database.set(["users", userId], user);
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function createUser(user: DBUser, provider?: SupportedProviders, providerProfile?: ProviderProfile) {
    try {
        const userId = genULID();
        user.userId = userId;

        if (provider && providerProfile) {
            await addOrUpdateProvider(user, provider, providerProfile);
        } else {
            await database.set(["users", userId], user);
        }

        return userId;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function addOrUpdateProvider(user: DBUser, provider: SupportedProviders, providerProfile: ProviderProfile) {
    try {
        if (user.userId && providerProfile.id) {
            if (!user.providers) {
                user.providers = {};
            }
            user.providers[provider] = providerProfile;
            await database.set(["users", provider, providerProfile.id], user.userId);
            await database.set(["users", user.userId], user);
            return true;
        }

        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function insertRealm(realm: Realm): Promise<boolean> {
    try {
        console.log("insert realm", realm);
        await database.set(["realms", realm.ownerId!, realm.id], realm);
        return true;
    } catch (error) {
        console.error("Error writing realms", error);
        return false;
    }
}

export async function getRealms(userId: string): Promise<Realm[]> {
    const realmList = database.list({ prefix: ["realms", userId] });
    const realms: Realm[] = [];
    for await (const realm of realmList) {
        realms.push(realm.value as Realm);
    }

    return realms;
}

export async function deleteRealm(userId: string, realmId: string): Promise<boolean> {
    try {
        console.log("delete realm", userId, realmId);
        await database.delete(["realms", userId, realmId]);
        return true;
    } catch (error) {
        console.error("Error deleting realm", error);
        return false;
    }
}

export async function insertProject(project: Project): Promise<boolean> {
    try {
        console.log("insert prj", project);
        await database.set(["projects", project.ownerId!, project.id], project);
        return true;
    } catch (error) {
        console.error("Error writing project", error);
        return false;
    }
}

export async function getProjects(userId: string): Promise<Project[]> {
    const projectList = database.list({ prefix: ["projects", userId] });
    const projects: Project[] = [];
    for await (const project of projectList) {
        projects.push(project.value as Project);
    }

    return projects;
}

export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
        console.log("delete proj", userId, projectId);
        await database.delete(["projects", userId, projectId]);
        return true;
    } catch (error) {
        console.error("Error deleting project", error);
        return false;
    }
}
