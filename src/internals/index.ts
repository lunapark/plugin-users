import { reactive } from "vue";

import type { TGeneralSettings } from "@/internals/general.ts";
import { EIdentifierType } from "@/internals/general.ts";
import { getProviderPreset } from "@/internals/presets.ts";
import type { TProvider } from "@/internals/providers.ts";
import type { TPermission, TRole } from "@/internals/roles.ts";
import { addPermissionsToRole, createPermission, createRole } from "@/internals/roles.ts";

export type TInternals = {
    files: Record<string, string>;
    general: TGeneralSettings;
    permissions: Record<string, TPermission>;
    providers: Record<string, TProvider>;
    roles: Record<string, TRole>;
};

export const internals = reactive<TInternals>({
    files: {},
    general: {
        identifier: EIdentifierType.email
    },
    permissions: {},
    providers: {},
    roles: {}
});

export function addPermission(permission: TPermission) {
    if (internals.permissions[permission.id]) {
        return false;
    }

    internals.permissions[permission.id] = permission;
    return true;
}

export function addRole(role: TRole) {
    if (internals.roles[role.id]) {
        return false;
    }

    internals.roles[role.id] = role;
    return true;
}

export function setIdentifier(identifier: EIdentifierType) {
    const previous = internals.general.identifier;
    internals.general.identifier = identifier;

    for (const provider of Object.values(internals.providers)) {
        const preset = getProviderPreset(provider.preset);

        if (!preset) {
            continue;
        }

        for (const data of [provider.data.development, provider.data.production]) {
            if (data.api.value === preset.api.value[previous]) {
                data.api.value = preset.api.value[identifier];
            }
        }
    }
}

function initInternals() {
    const permissionWrite = createPermission({ id: "write", label: "Write" });
    const permissionRead = createPermission({ id: "read", label: "Read" });

    addPermission(permissionWrite);
    addPermission(permissionRead);

    const roleAdmin = createRole({ id: "admin", label: "Admin" });
    const roleUser = createRole({ id: "user", freeze: true, label: "User" });
    const roleAnonymous = createRole({ id: "anonymous", freeze: true, label: "Anonymous" });

    addPermissionsToRole(roleUser, [permissionRead]);
    addPermissionsToRole(roleAdmin, [permissionRead, permissionWrite]);

    addRole(roleAdmin);
    addRole(roleUser);
    addRole(roleAnonymous);
}

initInternals();
