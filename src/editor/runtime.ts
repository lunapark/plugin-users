import { database, env } from "@/env.ts";
import { internals } from "@/internals";
import { getRolesPermissions } from "@/internals/roles.ts";
import type { TSessionRecord, TUserRecord } from "@/runtime/config.ts";
import { configureUsers } from "@/runtime/config.ts";
import { generateHexToken } from "@/runtime/hash.ts";

export function configureEditorRuntime() {
    const users = database.users!.db;
    const sessions = database.sessions!.db;

    configureUsers({
        config: {
            get identifier() {
                return internals.general.identifier;
            },
            get providers() {
                return Object.fromEntries(Object.values(internals.providers).map((provider) => [provider.id, provider.data.development]));
            },
            get roles() {
                return getRolesPermissions(internals.roles);
            }
        },
        cookies: {
            clear: (key) => delete env.backend.cookies[key],
            get: (key) => env.backend.cookies[key]?.value,
            set: (key, value) => env.backend.cookies[key] = { value }
        },
        db: {
            sessions: {
                delete: (filter) => sessions.delete(filter),
                find: async (filter) => await sessions.find(filter) as Array<TSessionRecord>,
                insert: async (data) => await sessions.insert(data) as TSessionRecord,
                update: (filter, data) => sessions.update(filter, data)
            },
            users: {
                delete: (filter) => users.delete(filter),
                find: async (filter) => await users.find(filter) as Array<TUserRecord>,
                findByAuth: async (providerId, id) => await users.find({ auth: { [providerId]: id } }) as Array<TUserRecord>,
                insert: async (data) => await users.insert(data) as TUserRecord,
                update: (filter, data) => users.update(filter, data)
            }
        },
        secret: generateHexToken()
    });
}
