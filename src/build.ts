import type { TEnv } from "@luna-park/plugin";
import { EInjectionKey } from "@luna-park/plugin";

import type { TInternals } from "@/internals";
import { resolveProductionData } from "@/internals/providers.ts";
import { getRolesPermissions } from "@/internals/roles.ts";
import { serverTarget } from "@/nodes/user.ts";

import packageDefinition from "../package.json" with { type: "json" };

export const backImports = [{ name: packageDefinition.name, version: packageDefinition.version }];

function getSecretEnvKey(providerId: string) {
    return `USERS_OAUTH_SECRET_${ providerId.replaceAll(/[^a-zA-Z0-9]/g, "_").toUpperCase() }`;
}

export function getEnv({ internals }: TEnv<never, TInternals>) {
    return Object.fromEntries(Object.values(internals.providers)
        .map((provider) => [getSecretEnvKey(provider.id), resolveProductionData(provider).client.secret]));
}

export function getInjections({ internals }: TEnv<never, TInternals>) {
    const providers = JSON.stringify(Object.fromEntries(Object.values(internals.providers).map((provider) => {
        const production = resolveProductionData(provider);
        return [provider.id, { ...production, client: { ...production.client, secret: getSecretEnvKey(provider.id) } }];
    }))).replaceAll(/"(USERS_OAUTH_SECRET_\w+)"/g, "process.env.$1");

    // language=JavaScript
    const serverImport = `
import { authConnect, configureUsers, generateHexToken, getAuthorizationUrl, resolveUser } from "${ serverTarget }";
import { dbDelete, dbFind, dbInsert, dbQuerySelect } from "@/database/index.js";
import { getRequestContext } from "@/context.js";
`;

    // language=JavaScript
    const serverBody = `
const usersTable = ${ JSON.stringify(internals.files["users-db"]) };
const sessionsTable = ${ JSON.stringify(internals.files["sessions-db"]) };
const usersProviders = ${ providers };
const usersCookieOptions = { httpOnly: true, path: "/", sameSite: "strict", secure: true, signed: true };

function getUsersCookie(request, key) {
    const raw = request.cookies[key];
    if (!raw) {
        return;
    }
    const cookie = request.unsignCookie(raw);
    return cookie.valid ? cookie.value : undefined;
}

configureUsers({
    config: {
        providers: usersProviders,
        roles: ${ JSON.stringify(getRolesPermissions(internals.roles)) }
    },
    cookies: {
        clear: (key) => getRequestContext().reply.clearCookie(key, { path: "/" }),
        get: (key) => getUsersCookie(getRequestContext().request, key),
        set: (key, value) => getRequestContext().reply.setCookie(key, value, { ...usersCookieOptions, maxAge: 60 * 60 * 24 * 365 })
    },
    db: {
        sessions: {
            delete: (filter) => dbDelete(sessionsTable, filter),
            find: (filter) => dbFind(sessionsTable, filter),
            insert: (data) => dbInsert(sessionsTable, data)
        },
        users: {
            delete: (filter) => dbDelete(usersTable, filter),
            find: (filter) => dbFind(usersTable, filter),
            findByAuth: (providerId, id) => dbQuerySelect({
                columns: [],
                database: usersTable,
                groups: [],
                joins: [],
                operation: { conditions: [{ operation: "contains", source: ["auth"], target: { [providerId]: id }, type: "value" }], type: "and" },
                orders: []
            }),
            insert: (data) => dbInsert(usersTable, data)
        }
    }
});

server.addHook("preHandler", async (request) => {
    if (request.url.startsWith(serverConfig.prefix + "/")) {
        request.context.in_user = await resolveUser();
    }
});

await server.register(async (users) => {
    users.get("/_users/me", async (request) => request.context.in_user);

    users.get("/_users/oauth/start", async (request, reply) => {
        const { mode, provider } = request.query;
        if (!usersProviders[provider] || !["login", "signup", "both"].includes(mode)) {
            return reply.code(400).send({ message: "Invalid OAuth provider or mode." });
        }
        const state = generateHexToken(16);
        reply.setCookie("users_oauth", JSON.stringify({ mode, provider, state }), { ...usersCookieOptions, maxAge: 600, sameSite: "lax" });
        return reply.redirect(getAuthorizationUrl(usersProviders[provider], state));
    });

    users.get("/_users/oauth/callback", async (request, reply) => {
        const saved = getUsersCookie(request, "users_oauth");
        reply.clearCookie("users_oauth", { path: "/" });
        let status = "error";
        if (saved) {
            const { mode, provider, state } = JSON.parse(saved);
            if (state === request.query.state && request.query.code) {
                try {
                    await authConnect(provider, request.query.code, mode);
                    status = "connected";
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        return reply.type("text/html").send(\`<script>window.opener?.postMessage({ oauth: "\${ status }" }, "*");window.close();</script>\`);
    });
}, { prefix: serverConfig.prefix });
`;

    return {
        [EInjectionKey.ServerImport]: serverImport,
        [EInjectionKey.ServerBody]: serverBody
    };
}
