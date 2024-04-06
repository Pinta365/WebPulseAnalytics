import { Handlers } from "$fresh/server.ts";
import { GitHubProvider } from "lib/auth/github.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { generateKey, signJWT } from "@cross/jwt";
import { createUser, getUserFromProviderId, updateUser } from "lib/db.ts";
import { DBUser, ProviderProfile } from "lib/db.ts";

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
            const auth = await GitHubProvider.authToken(
                config.github.callbackUrl,
                config.github.clientId,
                config.github.clientSecret,
                code,
            );

            const githubProfile: ProviderProfile = await GitHubProvider.profile(auth.access_token);

            // closed beta check :P

            const betaAllowedAccounts = [19735646, 419737];
            if (!betaAllowedAccounts.includes(githubProfile.id)) {
                console.log("Failed login:", githubProfile.id, githubProfile.name);
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

            if (alreadyUser?._id) {
                sessionUser._id = alreadyUser._id;
                alreadyUser.displayName = providerProfile.name;
                alreadyUser.avatar = providerProfile.avatar_url;
                await updateUser(alreadyUser._id, alreadyUser, "github", providerProfile);
            } else {
                const createdId = await createUser(sessionUser, "github", providerProfile);
                console.log(createdId);
                if (createdId) {
                    sessionUser._id = createdId;
                } else {
                    return new Response("Error processing authentication", { status: 500 });
                }
            }
            const jwtSecret = await generateKey(config.jwt.secret);
            const jwtContent = {
                _id: sessionUser._id!.toString(),
                displayName: sessionUser.displayName!,
                avatar: sessionUser.avatar!,
            };
            const jwt = await signJWT(jwtContent, jwtSecret);
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
