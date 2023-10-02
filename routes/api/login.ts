import { Handlers } from "$fresh/server.ts";
import { encode } from "$std/encoding/base64url.ts";
import { setCookie } from "$std/http/cookie.ts";
import { config } from "lib/config.ts";


function generateStateString(length: number): string {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  return encode(randomBytes);
}

export const handler: Handlers = {
  GET(req) {
    const state = generateStateString(16);
    const headers = new Headers();
    const url = new URL(req.url);
    
    // Set state cookie
    setCookie(headers, {
      name: config.github.cookieName,
      value: state,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
    });

    // Construct GitHub OAuth authorization URL
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.search = new URLSearchParams({
      client_id: config.github.clientId,
      redirect_uri: config.github.callbackUrl,
      state: state,
    }).toString();

    headers.set("location", authorizeUrl.toString());
    
    return new Response("", {
      status: 303,
      headers,
    });
  },
};
