const {
    GITHUB_COOKIE_STATE_NAME,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    JWT_SECRET,
    JWT_COOKIE,
    WEBSITE_BASE_URL,
    MONGO_URI
} = Deno.env.toObject();

function getOrThrow(
    envVar: string | undefined,
    name: string,
    defaultValue?: string,
): string {
    if (envVar) return envVar;
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${name} is not set`);
}

export const config = {
    github: {
        cookieName: getOrThrow(
            GITHUB_COOKIE_STATE_NAME,
            "GITHUB_COOKIE_STATE_NAME",
            "webpulse_auth_state",
        ),
        clientId: getOrThrow(GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID"),
        clientSecret: getOrThrow(GITHUB_CLIENT_SECRET, "GITHUB_CLIENT_SECRET"),
        callbackUrl: getOrThrow(GITHUB_CALLBACK_URL, "GITHUB_CALLBACK_URL"),
        apiBaseUrl: "https://api.github.com",
    },
    jwt: {
        secret: getOrThrow(JWT_SECRET, "JWT_SECRET"),
        cookieName: getOrThrow(JWT_COOKIE, "JWT_COOKIE", "webpulse_sess"),
    },
    common: {
        websiteBaseURL: getOrThrow(WEBSITE_BASE_URL, "WEBSITE_BASE_URL", "http://localhost:8000"),
    },
    mongo: {
        mongoUri: getOrThrow(MONGO_URI, "MONGO_URI"),
    }
};
