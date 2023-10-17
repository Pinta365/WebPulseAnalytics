import { AddRealm } from "islands/AddRealm.tsx";
import { DelRealmButton } from "islands/DelRealmButton.tsx";
import { Realm } from "lib/commonTypes.ts";

interface Realms {
    realms: Realm[];
}

function printRealm(realm: Realm) {
    return (
        <details class="w-50">
            <summary class="secondary">{realm.name}</summary>
            <small>Id: {realm.id}</small>
            {realm.description &&
                <div>Description: {realm.description}</div>}
            {realm.allowedOrigins &&
                <div>Allowed Origins: {realm.allowedOrigins}</div>}
            <p>
                <br />
                <a href="#" role="button" class="secondary outline w-25">Edit</a>
                <DelRealmButton id={realm.id} />
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
            {realms?.length > 0 ? realms.map((realm: Realm) => printRealm(realm)) : <p>No realms</p>}
        </section>
    );
}
