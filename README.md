# @luna-park/plugin-users

Users plugin for the **Luna Park** editor. This package adds user accounts, connections (OAuth2), and role-based management to your visual scripting environment.

## Features

- **User Management**: Signup, login, and session handling.
- **Role-Based Access Control**: Assign roles and verify permissions.
- **OAuth2 Integration**: Connect with external providers (e.g., Google, GitHub).
- **Security**: Argon2id hashing for secure password storage.
- **Built-in Storage**: Automatic initialization of `users` and `sessions` databases.

## Installation

This plugin is designed to be used within a Luna Park project.

```bash
pnpm add @luna-park/plugin-users
```

## Quick Start (Default Admin)

Upon mounting, the plugin automatically creates a default administrator account if no user database exists:

- **Login**: `admin`
- **Password**: `admin`

> [!IMPORTANT]
> Change the default administrator password immediately after the first login for security.

## Visual Scripting Nodes

The plugin adds the following nodes to the Luna Park editor:

### User
- `user/connect`: Authenticate a user via login and password. Supports `login`, `signup`, or `both`.
- `user/disconnect`: Terminate the current session or all active sessions.

### OAuth
- `oauth/connect`: Authenticate via an external OAuth2 provider.

### Roles & Permissions
- `roles/has-permission`: Checks if the current user has a specific permission.
- `roles/assert-permission`: Throws a `Forbidden` error if the user lacks the required permission.

### Hashing
- `hash/hash-argon2`: Hashes a string using the Argon2id algorithm.
- `hash/verify-argon2`: Verifies a password against an Argon2 hash.

## Configuration & Settings

The plugin adds two settings tabs to the Luna Park editor:

1.  **General**: Basic user and session configuration.
2.  **OAuth2**: Manage external authentication providers (Client IDs, Secrets, and Redirect URIs).

## Database Structure

The plugin manages two core file-based databases:

-   **Users**: Stores user profiles, credentials (hashed), and roles.
-   **Sessions**: Manages active user sessions.

---
Developed by [Luna Park](https://luna-park.app).
