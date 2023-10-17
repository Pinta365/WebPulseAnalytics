# WebPulse Analytics Front-end Website

Source code of https://webpulseanalytics.com/ , which could be leveraged to create a custom front-end for the [WebPulse Analytics Backend](https://github.com/pinta365/webpulsebackend).

## Getting started

### Create a `.env`

```dotenv
# WebPulse Analytics Frontend .env Configuration

# JSON Web Token (JWT) secret for cookie encryption
JWT_SECRET=your_jwt_secret_here
JWT_COOKIE=webpulse_sess

# GitHub authentication
GITHUB_COOKIE_STATE_NAME=webpulse_auth_state
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback

# Base URL for your website
WEBSITE_BASE_URL=http://localhost:8000

# Deno key-value (KV) database configuration
DENO_KV_LOCAL_DATABASE=./db/database
```

#### Creating a new JWT Secret

Copy, modify to preference, and paste the following code in a Deno REPL

```ts

import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

// Create a key
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

// Create jwt
console.log(await create({ alg: "HS512", typ: "JWT" }, { foo: "bar" }, key));

```

#### Creating a new GitHub OAuth application

1. **Login to GitHub:**
   Login to your GitHub account if you're not already logged in.

2. **Access Developer Settings:**
   - Click on your profile picture in the top right corner.
   - From the dropdown menu, select "Settings."

3. **Create a New OAuth Application:**
   - In the left sidebar, scroll down and select "Developer settings."
   - Under "OAuth Apps," click on "New OAuth App."

4. **Fill in OAuth Application Details:**
   - **Application Name:** Choose a name for your OAuth application. This is the name that users will see when authorizing your application.
   - **Homepage URL:** This should match your application's base URL.
   - **Application Description (Optional):** You can provide a brief description of your application.
   - **Authorization Callback URL:** Set this to the `GITHUB_CALLBACK_URL` from your `.env` file. In your case, it's likely `http://localhost:8000/api/auth/github/callback` for a local development environment.

5. **Access Your GitHub OAuth Application:**
   - Once you've filled in the details, click "Register application."

6. **Copy Your GitHub OAuth Application Values:**
   - After registering the application, you will be taken to the application details page.
   - Here, you can find your `Client ID` and `Client Secret`. These are the values you need for the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env` file.

7. **Use the GitHub OAuth Application Values:**
   - Copy the `Client ID` and `Client Secret` and paste them into your `.env` file, replacing `your_github_client_id` and `your_github_client_secret` with the values you obtained from GitHub.

Your GitHub OAuth Application is now set up, and your Deno application can use these values for GitHub user authentication. Make sure to keep your `Client Secret` secure and do not share it in public repositories or with unauthorized individuals.

### Start the server

```bash
deno task start
```

And you will reach the front-end at [http://localhost:8000/](http://localhost:8000/)