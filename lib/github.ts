import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { config } from "lib/config.ts";

const GITHUB_AUTH_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_ENDPOINT = "/user";

async function fetchWithCheck(url: string, options: RequestInit) {
    const response = await fetch(url, options);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(`${response.status} - ${response.statusText}`);
}

export async function authToken(
    redirectURI: string,
    clientID: string,
    clientSecret: string,
    code: string,
) {
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

    return await fetchWithCheck(GITHUB_AUTH_URL, options);
}

export async function profile(accessToken: string) {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    };

    return await fetchWithCheck(`${config.github.apiBaseUrl}${GITHUB_USER_ENDPOINT}`, options);
}
