# WebPulse Analytics Front-end Website

Source code of https://webpulseanalytics.com/, which could be leveraged to create a custom front-end for the
[WebPulse Analytics Backend](https://github.com/pinta365/webpulsebackend).

## Getting started

For instructions on setting up your own front end, or contributing to webpulse, see
[developer.webpulseanalytics.com/](https://developer.webpulseanalytics.com/frontend/).

**Short version:**

The short version is to create an `.env` with the following content:

```dotenv
# WebPulse Analytics Frontend .env Configuration

# JSON Web Token (JWT) secret for cookie encryption
JWT_SECRET=<your_jwt_secret_here>
JWT_COOKIE=webpulse_sess

# GitHub authentication
GITHUB_COOKIE_STATE_NAME=webpulse_auth_state
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback

# Base URL for your website
WEBSITE_BASE_URL=http://localhost:8000

# MongoDB configuration
MONGO_URI=mongodb://localhost:27017/
```

... and starting the server using this command:

```bash
deno task start
```

Then you will reach the front-end at [http://localhost:8000/](http://localhost:8000/)

## The dashboard

- **Overview** (`/dashboard`): headline metrics across all projects, a visitors chart compared with the previous period,
  a card per site, and top pages and sources.
- **Analytics** (`/dashboard/analytics/all` or `/dashboard/analytics/<projectId>`): one page per project or for all
  projects. Query parameters:
  - `range`: `30m`, `today`, `yesterday`, `7d` (default), `30d`, `90d`, `ytd`, `12m` or `last-year`
  - `metric`: the metric to chart, e.g. `visitors`, `pageLoads`, `bounceRate`
  - `bots=1`: include bot traffic (see below)
- **Projects** and **Settings**: manage tracked sites, theme and date/number locale.

Old `/dashboard/realtime/...` and `/dashboard/trends/...` URLs redirect to the Analytics page.

### Bot traffic

Bot sessions are excluded from all numbers by default. A toolbar chip shows how many were hidden and toggles them back
in, and the **Bots** tab lists them by name and category.

The [backend](https://github.com/pinta365/webpulsebackend) classifies each session at ingest into `session.bot`
(`{ isBot, name?, category?, reasons }`), from the raw request user agent, even when the project does not store user
agents. Sessions recorded before that have no `bot` field; for those the dashboard falls back to matching the stored
user agent against `BOT_USER_AGENT` in `lib/db.ts`. Bots that pretend to be a regular browser are not caught yet.

### Time zones

Days and hours are bucketed in the server's time zone (`TZ`), so "Today" starts at the server's midnight.

## Styling

Colors are design tokens defined as CSS custom properties in `static/css/styles.css`, with one set for light mode
(`:root`) and one for dark mode (`.dark`). Values are RGB channels (e.g. `--accent: 42 120 214`) so Tailwind opacity
modifiers work. `tailwind.config.ts` maps them to utilities:

| Token                | Utility examples                           | Used for                          |
| -------------------- | ------------------------------------------ | --------------------------------- |
| `canvas`             | `bg-canvas`                                | page background                   |
| `surface`            | `bg-surface`                               | cards, sidebar                    |
| `sunken`             | `bg-sunken`                                | hover washes, inputs, tracks      |
| `line`               | `border-line`                              | hairline borders                  |
| `fg`, `fg-2`, `fg-3` | `text-fg`, `text-fg-2`, `text-fg-3`        | primary, secondary and muted text |
| `accent`             | `bg-accent`, `text-accent`, `bg-accent/10` | brand and data color              |
| `good`, `bad`        | `text-good`, `text-bad`                    | positive and negative changes     |

Reusable component classes (`card`, `btn-primary`, `btn-secondary`, `input-base`, `segmented`, `menu`, `table`, `chip`,
…) live in the same file. To rebrand, change the token values; components pick them up automatically.

## Contributing

Before opening a pull request, make sure formatting, lint and type checks pass:

```bash
deno task check
```
