import type { TEnv } from "@luna-park/plugin";

import type { TInternals } from "@/internals";
import { onUserDelete } from "@/runtime/account.ts";
import type { TPublicUser } from "@/runtime/config.ts";
import { resolveUser } from "@/runtime/session.ts";

export type TUsersApi = {
    onUserDelete: (listener: (userId: string) => Promise<void> | void) => () => void;
    resolveUser: () => Promise<TPublicUser>;
    roles: () => Array<{ id: string; label: string; }>;
    usersTable: () => string | undefined;
};

export function getApi({ internals }: TEnv<never, TInternals>): TUsersApi {
    return {
        onUserDelete,
        resolveUser,
        roles: () => Object.values(internals.roles).map((role) => ({ id: role.id, label: role.label })),
        usersTable: () => internals.files["users-db"]
    };
}
