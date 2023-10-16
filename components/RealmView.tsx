import { AddRealm } from "islands/AddRealm.tsx";

interface Realm {
    id: string;
    ownerId?: string;
    name: string;
    description?: string;
    allowedOrigins?: string[];
}
interface Realms {
    realms: Realm[];
}

function printRealm(realm: Realm) {
    return (
        <details class="w-50">
            <summary class="secondary" role="button">{realm.name}</summary>

            {realm.description &&
                <div>Description: {realm.description}</div>}
            {realm.allowedOrigins &&
                <div>Allowed Origins: {realm.allowedOrigins}</div>}
            <p>
                <br />
                <a href="#" role="button" class="secondary outline w-25">Edit</a>
                <a href="#" role="button" class="secondary outline w-25">Delete</a>
            </p>
        </details>
    );
}

export function RealmView(data: Realms) {
    const { realms } = data;
    return (
        <section>
            <h1>Realms</h1>
            <AddRealm />
            {realms.length === 0 ? <p>No realms</p> : realms.map((realm: Realm) => printRealm(realm))}
        </section>
    );
}
