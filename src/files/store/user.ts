import type { TFileStore } from "@luna-park/plugin";
import { EElementType, LogicType } from "@luna-park/plugin";

import { env } from "@/env.ts";
import { internals } from "@/internals";

export async function initUserStore() {
    if (!internals.files["user-store"] || !env.getFile(internals.files["user-store"])) {
        const file = env.addFile(await getUserStore());
        internals.files["user-store"] = file.id;
    }
}

async function getUserStore() {
    return {
        name: "User Store",
        schema: LogicType.object({
            isConnected: LogicType.boolean({ name: "isConnected", options: { freeze: true } }),
            user: LogicType.object({
                id: LogicType.string({ name: "id", options: { freeze: true } }),
                login: LogicType.string({ name: "login", options: { freeze: true } }),
                roles: LogicType.array(LogicType.string({ options: { freeze: true } }), { name: "roles", options: { freeze: true } })
            }, {
                name: "user",
                optional: true,
                options: { freeze: true }
            })
        }, {
            options: { freeze: true }
        }),
        type: EElementType.Store
    } satisfies Partial<TFileStore<true>>;
}
