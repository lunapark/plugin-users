import type { TEnv } from "@luna-park/plugin";
import { EInjectionKey } from "@luna-park/plugin";

import { generateUserStoreUpdate } from "@/files/store/user.ts";
import type { TInternals } from "@/internals";
import { getDefaultPasswordPolicy } from "@/internals/general.ts";
import { resolveProductionData } from "@/internals/providers.ts";
import { getRolesPermissions } from "@/internals/roles.ts";
import { serverTarget } from "@/nodes/user.ts";

import packageDefinition from "../package.json" with { type: "json" };

export const backImports = [{ name: packageDefinition.name, version: packageDefinition.version }];
export const frontImports = backImports;

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
import { authConnect, authLink, configureUsers, disconnect, generateHexToken, getAuthorizationUrl, passwordConnect, resolveUser } from "${ serverTarget }";
import { dbDelete, dbFind, dbInsert, dbQuerySelect, dbUpdate } from "@/database/index.js";
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
        identifier: ${ JSON.stringify(internals.general.identifier) },
        password: ${ JSON.stringify(internals.general.password ?? getDefaultPasswordPolicy()) },
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
            insert: (data) => dbInsert(sessionsTable, data),
            update: (filter, data) => dbUpdate(sessionsTable, filter, data)
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
            insert: (data) => dbInsert(usersTable, data),
            update: (filter, data) => dbUpdate(usersTable, filter, data)
        }
    },
    secret: serverConfig.secret
});

server.addHook("preHandler", async (request) => {
    if (request.url.startsWith(serverConfig.prefix + "/")) {
        request.context.in_user = await resolveUser();
    }
});

await server.register(async (users) => {
    users.get("/_users/me", async (request) => request.context.in_user);

    users.post("/_users/connect", async (request, reply) => {
        const { login, mode, password } = request.body ?? {};
        if (typeof login !== "string" || typeof password !== "string" || !["login", "signup", "both"].includes(mode)) {
            return reply.code(400).send({ message: "Invalid login, password or mode." });
        }
        return await passwordConnect(login, password, mode);
    });

    users.post("/_users/disconnect", async (request) => {
        await disconnect(request.body?.mode === "all" ? "all" : "logout");
        return {};
    });

    users.get("/_users/oauth/start", async (request, reply) => {
        const { mode, origin, provider } = request.query;
        if (!usersProviders[provider] || !["login", "signup", "both", "link"].includes(mode) || !URL.canParse(origin) || new URL(origin).origin !== origin) {
            return reply.code(400).send({ message: "Invalid OAuth provider, mode or origin." });
        }
        const user = request.context.in_user.id;
        if (mode === "link" && !user) {
            return reply.code(401).send({ message: "You must be logged in to link an account." });
        }
        const state = generateHexToken(16);
        reply.setCookie("users_oauth", JSON.stringify({ mode, origin, provider, state, user }), { ...usersCookieOptions, maxAge: 600, sameSite: "lax" });
        return reply.redirect(getAuthorizationUrl(usersProviders[provider], state));
    });

    users.get("/_users/oauth/callback", async (request, reply) => {
        const saved = getUsersCookie(request, "users_oauth");
        reply.clearCookie("users_oauth", { path: "/" });
        if (!saved) {
            return reply.code(400).type("text/html").send("OAuth session expired. Please try again.");
        }
        const { mode, origin, provider, state, user } = JSON.parse(saved);
        let result = { message: "Invalid OAuth state.", oauth: "error" };
        if (state === request.query.state && request.query.code) {
            try {
                const connected = mode === "link"
                    ? await authLink(provider, request.query.code, user)
                    : await authConnect(provider, request.query.code, mode);
                result = { oauth: "connected", user: connected };
            }
            catch (error) {
                console.error(error);
                result = { message: error.message, oauth: "error" };
            }
        }
        return reply.type("text/html").send(\`<script>window.opener?.postMessage(\${ JSON.stringify(result).replaceAll("<", "\\\\u003c") }, \${ JSON.stringify(origin) });window.close();</script>\`);
    });
}, { prefix: serverConfig.prefix });
`;

    // language=JavaScript
    const appSetup = `
import { route as usersRoute } from "@/utils/api";
usersRoute({ method: "get", url: "/_users/me" }).then((user) => {
    ${ generateUserStoreUpdate(internals.files["user-store"], "user") }
});
`;

    return {
        [EInjectionKey.AppSetup]: appSetup,
        [EInjectionKey.ServerImport]: serverImport,
        [EInjectionKey.ServerBody]: serverBody
    };
}
