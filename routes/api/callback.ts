import { Handlers } from "$fresh/server.ts";
import { authToken, profile } from "lib/github.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { createJWT, genKey } from "lib/jwt.ts";
import { createUser, getUserFromProviderId, updateUser } from "db/db.ts";
import { DBUser, ProviderProfile } from "lib/commonTypes.ts";

import { config } from "lib/config.ts";

export const handler: Handlers = {
    async GET(req) {
        const url = new URL(req.url);
        const params = url.searchParams;
        const headers = new Headers();

        const code = params.get("code") || "";
        const state = params.get("state") || undefined;
        const storedState = getCookies(req.headers)[config.github.cookieName] || undefined;

        // Validate OAuth state to prevent CSRF attacks
        if (!state || state !== storedState) {
            return new Response("State mismatch", { status: 406 });
        }

        // Clear stored state
        deleteCookie(headers, config.github.cookieName, {
            path: "/",
            domain: url.hostname,
        });

        try {
            const auth = await authToken(
                config.github.callbackUrl,
                config.github.clientId,
                config.github.clientSecret,
                code,
            );

            const githubProfile: ProviderProfile = await profile(auth.access_token);

            // closed beta check :P

            const betaAllowedAccounts = ["19735646"];
            if (!betaAllowedAccounts.includes(githubProfile.id)) {
                console.log("Failed login:", githubProfile.id, githubProfile.html_url);
                headers.set("location", "/closedBeta");
                return new Response("", { status: 303, headers });
            }

            const alreadyUser: DBUser = await getUserFromProviderId("github", githubProfile.id);
            const sessionUser = {} as DBUser;
            const providerProfile: ProviderProfile = {
                id: githubProfile.id,
                name: githubProfile.name,
                avatar_url: githubProfile.avatar_url,
            };

            sessionUser.displayName = providerProfile.name;
            sessionUser.avatar = providerProfile.avatar_url;

            if (alreadyUser?.userId) {
                sessionUser.userId = alreadyUser.userId;
                alreadyUser.displayName = providerProfile.name;
                alreadyUser.avatar = providerProfile.avatar_url;
                await updateUser(alreadyUser.userId, alreadyUser, "github", providerProfile);
            } else {
                const createdId = await createUser(sessionUser, "github", providerProfile);
                if (createdId) {
                    sessionUser.userId = createdId;
                } else {
                    return new Response("Error processing authentication", { status: 500 });
                }
            }

            const jwtSecret = await genKey(config.jwt.secret);
            const jwtContent = {
                userId: sessionUser.userId!,
                displayName: sessionUser.displayName!,
                avatar: sessionUser.avatar!,
            };
            const jwt = await createJWT(jwtSecret, jwtContent);

            setCookie(headers, {
                name: config.jwt.cookieName,
                value: jwt,
                sameSite: "Lax",
                domain: url.hostname,
                path: "/",
            });
        } catch (error) {
            console.error(error);
            return new Response("Error processing authentication", { status: 500 });
        }

        headers.set("location", "/");
        return new Response("", { status: 303, headers });
    },
};
