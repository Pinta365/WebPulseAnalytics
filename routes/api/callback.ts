import { Handlers } from "$fresh/server.ts";
import { authToken, profile } from "lib/github.ts";
import { getCookies, setCookie, deleteCookie } from "$std/http/cookie.ts";
import { createJWT, genKey } from "lib/jwt.ts";
import { setUserinfoFromId } from "db/db.ts";
import { DBUser } from "lib/commonTypes.ts"
import { config } from "lib/config.ts";

export interface GithubProfile {
  login: string; //"Pinta365",
  name: string; //"Pinta",
  id: string; //19735646,
  avatar_url: string; //"https://avatars.githubusercontent.com/u/19735646?v=4",
  url: string; //"https://api.github.com/users/Pinta365",
  html_url: string; //"https://github.com/Pinta365",
}

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

      const githubProfile: GithubProfile = await profile(auth.access_token);

      const sessionUser: DBUser = {
        login: githubProfile.login,
        name: githubProfile.name,
        id: githubProfile.id,
        avatar_url: githubProfile.avatar_url,
        url: githubProfile.url,
        html_url: githubProfile.html_url,
      };

      await setUserinfoFromId(sessionUser.id, sessionUser);

      const jwtSecret = await genKey(config.jwt.secret);
      const jwt = await createJWT(jwtSecret, { sessionUser: sessionUser.id });

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
