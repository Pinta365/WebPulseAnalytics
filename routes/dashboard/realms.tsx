import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealmView } from "components/RealmView.tsx";
import { Footer } from "components/layout/Footer.tsx";

interface Realm {
    id: string;
    ownerId?: string;
    name: string;
    description?: string;
    allowedOrigins?: string[];
}

async function getRealms(userId: string) {
    const database = await Deno.openKv(Deno.env.get("WEBPULSE_STAT_DATABASE"));
    // Need an index to get user realms. Will filter on userId in the for loop for now.
    const realmList = database.list({ prefix: ["realms"] });
    const realms: Realm[] = [];
    for await (const realm of realmList) {
        const rlm = realm.value as Realm;
        if (rlm.ownerId === userId) {
            realms.push(rlm as Realm);
        }
    }

    return realms;
}

export const handler: Handlers = {
    async GET(_req, ctx) {
        const realms = await getRealms(ctx.state.userId as string);
        return ctx.render({ state: ctx.state, realms: realms });
    },
};

export default function Realms({ data }: PageProps) {
    const { state, realms } = data;
    return (
        <body>
            <NavTop {...state} />

            <main class="container">
                <div class="grid">
                    <NavSide />
                    <RealmView realms={realms} />
                </div>
            </main>

            <Footer />
            <script src="/js/pico.js"></script>
        </body>
    );
}
