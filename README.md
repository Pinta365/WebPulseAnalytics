# WebPulse Analytics Front-end Website

Source code of https://webpulseanalytics.com/ , which could be leveraged to create a custom front-end for the
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

# Deno key-value (KV) database configuration
DENO_KV_LOCAL_DATABASE=./db/database
```

... and starting the server using this command:

```bash
deno task start
```

Then you will reach the front-end at [http://localhost:8000/](http://localhost:8000/)
