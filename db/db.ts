import { DBUser, ProviderProfile, SupportedProviders } from "lib/commonTypes.ts";
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
