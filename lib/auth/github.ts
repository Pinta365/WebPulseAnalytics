import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { getConfig } from "lib/config.ts";

async function fetchWithCheck(url: string, options: RequestInit) {
    const response = await fetch(url, options);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(`${response.status} - ${response.statusText}`);
}
const createOAuthProvider = (authUrl: string, userEndpoint: string) => {
    return {
        authToken: async (redirectURI: string, clientID: string, clientSecret: string, code: string) => {
            const options = {
                method: "POST",
                body: new URLSearchParams({
                    code,
                    redirect_uri: redirectURI,
                    grant_type: "authorization_code",
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": `Basic ${encodeBase64Url(`${clientID}:${clientSecret}`)}`,
                },
            };

            return await fetchWithCheck(authUrl, options);
        },

        profile: async (accessToken: string) => {
            const options = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            };

            return await fetchWithCheck(`${getConfig().github.apiBaseUrl}${userEndpoint}`, options);
        },
    };
};

// GitHub Provider
export const GitHubProvider = createOAuthProvider("https://github.com/login/oauth/access_token", "/user");
