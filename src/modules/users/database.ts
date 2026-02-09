/* eslint-disable sort-keys-custom-order/object-keys */
import type { TFileDatabase } from "@luna-park/plugin";
import { EElementType, LogicType } from "@luna-park/plugin";
import { argon2id } from "hash-wasm";

export async function getDefaultDatabase() {
    const password = "admin";

    const salt = new Uint8Array(64);
    crypto.getRandomValues(salt);

    const passwordHash = await argon2id({ password, salt, parallelism: 1, iterations: 256, memorySize: 2048, hashLength: 64, outputType: "encoded" });
    const currentDate = new Date().toISOString();

    return {
        data: [
            {
                id: "c6bd3045-d139-41e4-a935-97c6a6895017",
                login: "admin",
                password: passwordHash,
                roles: ["admin"],
                created_at: currentDate,
                updated_at: currentDate
            }
        ],
        name: "Users",
        schema: LogicType.object({
            id: LogicType.string({ name: "id", options: { freeze: true } }),
            login: LogicType.string({ name: "login", options: { freeze: true } }),
            password: LogicType.string({ name: "password", options: { freeze: true } }),
            roles: LogicType.array(LogicType.string({ options: { freeze: true } }), { name: "roles", options: { freeze: true } }),
            created_at: LogicType.interface("Date", { name: "created_at", options: { freeze: true } }),
            updated_at: LogicType.interface("Date", { name: "updated_at", options: { freeze: true } })
        }, {
            options: { freeze: true, insert: -2 }
        }),
        type: EElementType.Database
    } satisfies Partial<TFileDatabase<true>>;
}
