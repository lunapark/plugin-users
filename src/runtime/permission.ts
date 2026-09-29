import { httpError } from "@luna-park/http-errors";

import type { TPublicUser } from "@/runtime/config.ts";
import { getRuntime } from "@/runtime/config.ts";

export function getPermissionsFromRoles(roles: Array<string>) {
    const { config } = getRuntime();
    return [...new Set(roles.flatMap((role) => config.roles[role] ?? []))];
}

export function hasPermission(user: TPublicUser, permission: string) {
    return getPermissionsFromRoles(user.roles).includes(permission);
}

export function assertAuthenticated(user: TPublicUser) {
    if (!user.id) {
        throw httpError.Unauthorized("You must be logged in to perform this action.");
    }
}

export function assertPermission(user: TPublicUser, permission: string) {
    if (hasPermission(user, permission)) {
        return;
    }

    assertAuthenticated(user);
    throw httpError.Forbidden("User doesn't have permission to perform this action.");
}
