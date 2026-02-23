import type { Static, TFileDatabase } from "@luna-park/plugin";
import { EElementType, LogicType } from "@luna-park/plugin";

import { database, env } from "@/env.ts";
import { internals } from "@/internals";

export function initSessionsDatabase() {
    if (!internals.files["sessions-db"] || !env.getFile(internals.files["sessions-db"])) {
        const file = env.addFile(getSessionsDatabase());
        internals.files["sessions-db"] = file.id;
    }

    database["sessions"] = env.getFile(internals.files["sessions-db"]) as TFileDatabase;
}

function getSessionsDatabase() {
    return {
        name: "Sessions",
        type: EElementType.Database,
        data: [],
        schema: LogicType.object({
            /* eslint-disable sort-keys-custom-order/object-keys */
            id: LogicType.string({ name: "id", options: { freeze: true } }),
            user: { ...LogicType.string({ name: "user", options: { freeze: true }, target: internals.files["users-db"] }), type: "foreign-key" },
            token: LogicType.string({ name: "token", options: { freeze: true } }),
            expires: LogicType.interface("Date", { name: "expires", options: { freeze: true } }),
            created_at: LogicType.interface("Date", { name: "created_at", options: { freeze: true } }),
            updated_at: LogicType.interface("Date", { name: "updated_at", options: { freeze: true } })
            /* eslint-enable sort-keys-custom-order/object-keys */
        }, {
            options: { freeze: true, insert: -2 }
        })
    } satisfies Partial<TFileDatabase<true>>;
}

export type TSession = Static<ReturnType<typeof getSessionsDatabase>["schema"]>;
