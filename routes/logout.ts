import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import { config } from "lib/config.ts";

export const handler: Handlers = {
  GET(req) {
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    // Clear JWT and GitHub cookies
    deleteCookie(headers, config.jwt.cookieName, {
      path: "/",
      domain: url.hostname,
    });
    deleteCookie(headers, config.github.cookieName, {
      path: "/",
      domain: url.hostname,
    });

    // Redirect to the root path
    headers.set("location", "/");
    
    return new Response("", {
      status: 302,
      headers,
    });
  },
};
