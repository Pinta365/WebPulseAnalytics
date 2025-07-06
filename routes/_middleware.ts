import { FreshContext } from "$fresh/server.ts";

import { SessionUser } from "lib/commonTypes.ts";
import { getCookies } from "$std/http/cookie.ts";
import { generateKey, validateJWT } from "@cross/jwt";
import { config } from "lib/config.ts";

export async function handler(
    req: Request,
    ctx: FreshContext<SessionUser>,
) {
    const { cookieName, secret } = config.jwt;
    const cookies = getCookies(req.headers);

    if (cookies[cookieName]) {
        const jwtSecret = await generateKey(secret);
        const jwt = await validateJWT(cookies[cookieName], jwtSecret) as unknown as SessionUser;
        ctx.state = jwt;
    }

    return ctx.next();
}
