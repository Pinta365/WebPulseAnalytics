import type { PageProps } from "$fresh/server.ts";
interface Realms {
    realms: {
        id: string;
        ownerId?: string;
        name: string;
        description?: string;
        allowedOrigins?: string[];
    }[];
}

export function RealmView(data: Realms) {
    const {realms} = data;
    return (
        <section>
            <h1>Realms</h1>
            {realms.length === 0 ? (
                <p>No realms</p>
            ) : (
                <ul>
                    {realms.map((realm) => (
                        <li key={realm.id}>{realm.name}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}
