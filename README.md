# 👥 Users plugin for Luna Park

Add **accounts, sessions, roles and OAuth sign-in** to your Luna Park app, and lock your backend routes behind **guards**, all without writing auth code.

What you build in the editor preview is exactly what runs once deployed: the same logic powers both, backed by the editor database while you design and by PostgreSQL in production.

## ✨ What you get

| | |
|---|---|
| 🔐 **Password auth** | Sign up, log in and log out, with passwords hashed using Argon2id. |
| 🌐 **OAuth2 sign-in** | Connect Google, GitHub or any OAuth2 provider, with a secure server-side flow (`state` check included). |
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
| `user/connect` | Backend | Log in, sign up, or both (`login` / `signup` / `both`) with a login and password. Outputs the connected user. |
| `user/disconnect` | Backend | Log out from this device (`logout`) or from every device (`all`). |
| `user/current` | Frontend | Get the user connected in this browser, and whether someone is connected. |
| `oauth/connect` | Frontend | Open the provider's sign-in popup, then connect the user (`login` / `signup` / `both`). |
| `roles/has-permission` | Backend | Check if a user has a permission. |
| `roles/assert-permission` | Backend | Stop with an error if a user lacks a permission. |
| `hash/hash-argon2` | Backend | Hash any string with Argon2id. |
| `hash/verify-argon2` | Backend | Check a string against an Argon2 hash. |

## ⚙️ Settings

- **General**: choose how users are identified (email or username), and manage **roles** and **permissions** in the Access panel.
- **OAuth2**: add providers with separate *development* and *production* credentials.

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
