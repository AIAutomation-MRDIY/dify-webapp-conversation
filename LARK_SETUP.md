# Lark Authentication + Vercel Deployment Guide

This app is protected by Lark (Feishu) OAuth. Every visitor must sign in with a
Lark account before they can see the chat UI or call any API. The signed-in
user's Lark `open_id` is passed to Dify as the `user`, so each employee keeps
their own conversation history.

## How it works

1. `middleware.ts` intercepts every request. No valid session cookie →
   pages redirect to `/api/auth/login`, API calls get `401`.
2. `/api/auth/login` redirects to Lark's OAuth authorize page. Inside the Lark
   app this is silent (no login screen). In a normal browser the user must log
   in to a Lark account **that belongs to your tenant and has access to the
   app** — everyone else is rejected.
3. `/api/auth/callback` exchanges the code server-side, fetches the user's
   profile, and sets a signed (HS256 JWT) `lark_session` cookie.
4. Optional hard mode: `LARK_CLIENT_ONLY=true` additionally rejects any request
   whose user agent is not the Lark client, so even employees cannot use it
   from a regular browser.

Other endpoints: `/api/auth/me` (current user profile), `/api/auth/logout`.

## Step 1 — Configure the Lark app

In the [Lark Developer Console](https://open.larksuite.com) open your app:

1. **Credentials & Basic Info** → copy the **App ID** and **App Secret**.
2. **Security Settings** → add the redirect URL:
   `https://<your-domain>.vercel.app/api/auth/callback`
   (add `http://localhost:3000/api/auth/callback` too for local testing).
3. **Features → Web App** → set the desired homepage to your Vercel URL.
4. **Permissions & Scopes** → make sure the app can read basic user info
   (`Obtain user basic information` / `authen` related scopes) and publish a
   version.
5. **App availability**: release the app to the members/departments who should
   be able to use it. Users outside that scope cannot complete the OAuth flow.

## Step 2 — Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_ID` | yes | Dify app ID |
| `NEXT_PUBLIC_APP_KEY` | yes | Dify app API key (`app-...`) |
| `NEXT_PUBLIC_API_URL` | yes | Dify API base, e.g. `https://api.dify.ai/v1` |
| `LARK_APP_ID` | yes | Lark app ID (`cli_...`) |
| `LARK_APP_SECRET` | yes | Lark app secret |
| `SESSION_SECRET` | yes | Long random string; generate with `openssl rand -hex 32` |
| `LARK_DOMAIN` | no | `larksuite` (default) or `feishu` |
| `LARK_TENANT_KEY` | no | Restrict logins to one tenant |
| `LARK_CLIENT_ONLY` | no | `true` = block normal browsers entirely |
| `SESSION_TTL` | no | Session lifetime in seconds (default 12h) |
| `APP_BASE_URL` | no | Force the public base URL if needed |

## Step 3 — Deploy to Vercel

1. Push this repo to your own GitHub/GitLab.
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
   Vercel auto-detects Next.js; no build settings needed.
3. Add all the environment variables above under
   **Project → Settings → Environment Variables** (Production).
4. Deploy, then put the final domain into the Lark console redirect URL
   (Step 1.2) and the web app homepage (Step 1.3).

## Step 4 — Test

- Open the app from Lark (workbench / app list): you should land in the chat
  with no login prompt.
- Open the Vercel URL in an incognito browser: you should be sent to the Lark
  login page; a non-tenant account gets rejected.
- With `LARK_CLIENT_ONLY=true`, a normal browser shows the
  "can only be opened from inside the Lark app" page instead.

## Local development

```bash
npx pnpm install
npx pnpm dev
```

Visit `http://localhost:3000` — you'll be redirected through the Lark login
(make sure the localhost redirect URL is registered in the Lark console).

## Notes

- The session cookie is `httpOnly`, `Secure`, signed with `SESSION_SECRET`.
  Rotating the secret invalidates all sessions.
- The user-agent check (`LARK_CLIENT_ONLY`) is a convenience filter, not a
  security boundary — the OAuth session is what actually protects the app.
- Dify sees users as `user_<dify-app-id>:<lark-open-id>`, visible in Dify's
  Logs & Annotations for per-user auditing.
