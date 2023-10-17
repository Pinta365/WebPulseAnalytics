import type { Handlers, PageProps } from "$fresh/server.ts";
import { NavTop } from "components/layout/NavTop.tsx";
import { NavSide } from "islands/NavSide.tsx";
import { RealmView } from "components/RealmView.tsx";
import { Footer } from "components/layout/Footer.tsx";
import { deleteRealm, getRealms, insertRealm } from "db/db.ts";
import { genULID } from "lib/helper.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const realms = await getRealms(ctx.state.userId as string);
        return ctx.render({ state: ctx.state, realms: realms });
    },

    async POST(req, ctx) {
        const params = new URLSearchParams(await req.text());

        const name = params.get("name");
        const description = params.get("description") || "";
        const ownerId = ctx.state.userId as string;
        const id = genULID();
        if (name && ownerId) {
            const insert = await insertRealm({
                id,
                ownerId,
                name,
                description,
            });

            if (insert) {
                return new Response("Ok", { status: 201 });
            } else {
                return new Response("Not insterted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },

    async DELETE(req, ctx) {
        const params = new URLSearchParams(await req.text());
        const ownerId = ctx.state.userId as string;
        const id = params.get("id");
        if (ownerId && id) {
            const del = await deleteRealm(ownerId, id);

            if (del) {
                return new Response("Ok", { status: 200 });
            } else {
                return new Response("Not deleted.", { status: 422 });
            }
        }

        return new Response("Bad Request", { status: 400 });
    },
    //async PUT(req, ctx){}, /* Uppdatera en realm */
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
