import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { config } from "lib/config.ts";
import { genKey, parseJWT } from "lib/jwt.ts";
import { getUserinfoFromId } from "db/db.ts";
import { Login } from "components/Login.tsx";
import { MainContent } from "components/MainContent.tsx";
import { Nav } from "components/Nav.tsx";
import { Footer } from "components/Footer.tsx";
import { SessionData, DBUser } from "lib/commonTypes.ts"

export const handler: Handlers = {
  async GET(req, ctx) {
    const { cookieName, secret } = config.jwt;
    let userInfo = {} as DBUser;
    const cookies = getCookies(req.headers);

    if (cookies[cookieName]) {
      const jwtSecret = await genKey(secret);
      const jwt = await parseJWT(jwtSecret, cookies[cookieName]);
      userInfo = await getUserinfoFromId(jwt.sessionUser);
    }

    return ctx.render({
      isAuthed: Boolean(userInfo?.id),
      userId: userInfo.id,
      userName: userInfo.name,
      avatar: userInfo.avatar_url,
    });
  },
};

export default function Home({ data }: PageProps<SessionData>) {
  return (
    <body>
      <Nav {...data} />
      <main>
        {!data.isAuthed ? <Login /> : <MainContent {...data} />}
      </main>
      <Footer />
      <script src="/js/theme_switcher.js"></script>
    </body>
  );
}
