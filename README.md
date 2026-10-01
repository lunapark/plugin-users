# 👥 Users plugin for Luna Park

Add **accounts, sessions, roles and OAuth sign-in** to your Luna Park app, and lock your backend routes behind **guards**, all without writing auth code.

What you build in the editor preview is exactly what runs once deployed: the same logic powers both, backed by the editor database while you design and by PostgreSQL in production.

## ✨ What you get

| | |
|---|---|
| 🔐 **Password auth** | Sign up, log in and log out, with passwords hashed using Argon2id. |
| 🌐 **OAuth2 sign-in** | One-click presets for Google, Discord, GitHub, Microsoft and GitLab, or any OAuth2 provider, with a secure server-side flow (`state` check included). |
| 🛡️ **Route guards** | Mark a route as *Authenticated* or *Requires permission X* in one click. |
| 🎭 **Roles & permissions** | Define roles, attach permissions, check them anywhere in your logic. |
| 🍪 **Sessions** | Signed, `httpOnly` cookies, one session per device, logout from one or all devices. |
| 🗄️ **Ready-made tables** | `Users` and `Sessions` databases are created for you. |

## 🚀 Getting started

1. In Luna Park, open **Library → Install Plugins**, search for **Users** and install it.
2. The plugin creates a `Users` table, a `Sessions` table and a `User Store`.
3. A default admin account is seeded: login `admin`, password `admin`.

> [!IMPORTANT]
> The default admin is only there to get you started. Delete it (or change its password) before going live.

## 🛡️ Protecting routes with guards

Select a route and open the **Guards** panel in the inspector, then click **+**:

- **Authenticated**: only logged-in users can call the route (otherwise `401`).
- **Permission**: only users whose roles grant the chosen permission can call it (`401` if anonymous, `403` otherwise).

Routes without guards stay public. Guards run *before* your route logic, both in the editor preview and in the deployed backend.

Every backend route also receives the current user as the `user` input (`id`, `login`, `roles`). Anonymous visitors get the `anonymous` role, so you can even grant permissions to non-logged-in users.

## 🧩 Nodes

| Node | Side | What it does |
|---|---|---|
| `user/connect` | Frontend | Log in, sign up, or both (`login` / `signup` / `both`) with a login and password, through the `/_users/connect` route. Outputs the connected user, and throws on failure (wrap it in `error/try` to handle it). |
| `user/disconnect` | Frontend | Log out from this device (`logout`) or from every device (`all`), through the `/_users/disconnect` route. |
| `user/connect-by-id` | Backend | Connect the caller as any user, without a password (impersonation, magic links...). Guard the route. |
| `user/disconnect-by-id` | Backend | Log out every session of any user. Guard the route. |
| `user/current` | Frontend | Get the user connected in this browser, and whether someone is connected. |
| `user/check-password` | Shared | Check a password against the password policy from the settings. Outputs whether it is valid and, if not, why (e.g. to give feedback on a sign-up form). |
| `user/change-password` | Backend | Change the connected user's password (current password required) and log out their other devices. |
| `user/request-password-reset` | Backend | Create a one-hour, single-use reset token for a login. Send it to the user yourself (by email, for example). |
| `user/reset-password` | Backend | Set a new password from a reset token and log out every device. |
| `user/list-sessions` | Backend | List the connected user's active sessions, flagging the current one. |
| `user/revoke-session` | Backend | Log out one of the connected user's sessions. |
| `user/delete` | Backend | Delete a user by id, with all their sessions. |
| `oauth/connect` | Frontend | Open the provider's sign-in popup, then connect the user (`login` / `signup` / `both`). |
| `oauth/link` | Frontend | Link a provider account to the connected user, so they can also sign in with it. |
| `roles/has-permission` | Backend | Check if a user has a permission. |
| `roles/assert-permission` | Backend | Stop with an error if a user lacks a permission. |
| `roles/set-roles` | Backend | Replace a user's roles (unknown roles are rejected). |
| `hash/hash-argon2` | Backend | Hash any string with Argon2id. |
| `hash/verify-argon2` | Backend | Check a string against an Argon2 hash. |

## ⚙️ Settings

- **General**: choose how users are identified (username or email), set the password policy (minimum length and required character types), and manage **roles** and **permissions** in the Access panel.
- **OAuth2**: add providers with separate *development* and *production* credentials. Empty production fields fall back to the development values (except the redirect URL).

### 🌐 OAuth quick setup

Click **Add a provider** and pick a preset: **Google**, **Discord**, **GitHub**, **Microsoft** or **GitLab**. Endpoints, scopes and identity mapping are filled in for you, and a setup guide links to the provider's console and gives the redirect URIs to register. You only paste the client ID and secret.

The authorization URL is completed automatically with `client_id`, `redirect_uri`, `response_type=code` and `scope` (values already in the URL are kept), so a custom provider only needs its base authorize endpoint.

For production, set each provider's redirect URI to:

```
https://<your-domain>/api/_users/oauth/callback
```

## 📦 In your deployed backend

When you build your project, the plugin wires itself into the generated server:

- **Endpoints**
  - `GET /api/_users/me` returns the connected user.
  - `GET /api/_users/oauth/start` and `GET /api/_users/oauth/callback` handle OAuth sign-in.
- **Secrets stay out of the code**: each provider's client secret is written to the project's `.env` as `USERS_OAUTH_SECRET_<PROVIDER_ID>` and read at runtime.
- **Runtime**: the logic is imported from `@luna-park/plugin-users/server`, which is added to your backend dependencies automatically.

## 🛠️ Development

```bash
pnpm install
pnpm build      # build the plugin
pnpm dev        # rebuild on change
pnpm preview    # serve it to the Luna Park editor (http://127.0.0.1:2084)
```

The package ships two entries:

- `@luna-park/plugin-users`: the editor plugin (settings, nodes, guards).
- `@luna-park/plugin-users/server`: the framework-agnostic runtime used by the generated backend.

---

Made with 💙 by [Luna Park](https://luna-park.app).
