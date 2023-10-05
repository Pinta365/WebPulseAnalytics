import { MiddlewareHandlerContext } from "$fresh/server.ts";

import { SessionUser } from "lib/commonTypes.ts";
import { getCookies } from "$std/http/cookie.ts";
import { genKey, parseJWT } from "lib/jwt.ts";
import { config } from "lib/config.ts";

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext<SessionUser>,
) {
    const { cookieName, secret } = config.jwt;
    const cookies = getCookies(req.headers);

    if (cookies[cookieName]) {
        const jwtSecret = await genKey(secret);
        const jwt = await parseJWT(jwtSecret, cookies[cookieName]) as unknown as SessionUser;
        /*const dbUser: DBUser = await getUser(jwt.userId);
        ctx.state = {
            userId: dbUser.userId!,
            displayName: dbUser.displayName,
            avatar: dbUser.avatar,
        };*/
        ctx.state = jwt;
    }

    return ctx.next();
}
