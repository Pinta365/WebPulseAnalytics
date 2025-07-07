import { Handlers } from "$fresh/server.ts";
import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { setCookie } from "$std/http/cookie.ts";
import { getConfig } from "lib/config.ts";

function generateStateString(length: number): string {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);

    return encodeBase64Url(randomBytes);
}

export const handler: Handlers = {
    GET(req) {
        const state = generateStateString(16);
        const headers = new Headers();
        const url = new URL(req.url);

        // Set state cookie
        setCookie(headers, {
            name: getConfig().github.cookieName,
            value: state,
            sameSite: "Lax",
            domain: url.hostname,
            path: "/",
        });

        // Construct GitHub OAuth authorization URL
        const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
        authorizeUrl.search = new URLSearchParams({
            client_id: getConfig().github.clientId,
            redirect_uri: getConfig().github.callbackUrl,
            state: state,
        }).toString();

        headers.set("location", authorizeUrl.toString());

        return new Response("", {
            status: 303,
            headers,
        });
    },
};
