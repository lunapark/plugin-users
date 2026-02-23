import type { Static, TFileDatabase } from "@luna-park/plugin";
import { EElementType, LogicType } from "@luna-park/plugin";
import { argon2id } from "hash-wasm";

import { database, env } from "@/env.ts";
import { internals } from "@/internals";

export async function initUsersDatabase() {
    if (!internals.files["user-db"] || !env.getFile(internals.files["user-db"])) {
        const file = env.addFile(await getUsersDatabase());
        internals.files["user-db"] = file.id;
    }

    database["user"] = env.getFile(internals.files["user-db"]) as TFileDatabase;
}

async function getUsersDatabase() {
    const password = "admin";

    const salt = new Uint8Array(64);
    crypto.getRandomValues(salt);

    const passwordHash = await argon2id({ hashLength: 64, iterations: 256, memorySize: 2048, outputType: "encoded", parallelism: 1, password, salt });
    const currentDate = new Date().toISOString();

    return {
        data: [
            {
                auth: {},
                created_at: currentDate,
                id: "c6bd3045-d139-41e4-a935-97c6a6895017",
                login: "admin",
                password: passwordHash,
                roles: ["admin"],
                updated_at: currentDate
            }
        ],
        name: "Users",
        schema: LogicType.object({
            /* eslint-disable sort-keys-custom-order/object-keys */
            id: LogicType.string({ name: "id", options: { freeze: true, readonly: true } }),
            login: LogicType.string({ name: "login", options: { freeze: true } }),
            password: LogicType.string({ name: "password", options: { freeze: true } }),
            auth: LogicType.object({}, { name: "auth", options: { freeze: true }, customizable: true }),
            roles: LogicType.array(LogicType.string({ options: { freeze: true } }), { name: "roles", options: { freeze: true } }),
            created_at: LogicType.interface("Date", { name: "created_at", options: { freeze: true, readonly: true } }),
            updated_at: LogicType.interface("Date", { name: "updated_at", options: { freeze: true, readonly: true } })
            /* eslint-enable sort-keys-custom-order/object-keys */
        }, {
            options: { freeze: true, insert: -2 }
        }),
        type: EElementType.Database
    } satisfies Partial<TFileDatabase<true>>;
}

export type TUser = Static<Awaited<ReturnType<typeof getUsersDatabase>>["schema"]>;
