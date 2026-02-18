import { reactive } from "vue";

import { EIdentifierType, type TGeneralSettings } from "@/internals/general.ts";
import type { TMailSettings } from "@/internals/mail.ts";
import type { TProvider } from "@/internals/providers.ts";
import { addPermissionsToRole, createPermission, createRole, type TPermission, type TRole } from "@/internals/roles.ts";

export type TInternals = {
    files: Record<string, string>;
    general: TGeneralSettings;
    mail: TMailSettings;
    permissions: Record<string, TPermission>;
    providers: Record<string, TProvider>;
    roles: Record<string, TRole>;
};

export const internals = reactive<TInternals>({
    files: {},
    general: {
        identifier: EIdentifierType.email
    },
    mail: {
        auth: {
            password: "",
            user: ""
        },
        host: "",
        port: 465,
        secure: true
    },
    permissions: {},
    providers: {},
    roles: {}
});

export function addPermission(permission: TPermission) {
    if (internals.permissions[permission.id]) {
        alert(`Permission with id ${ permission.id } already exists.`);
        return;
    }

    internals.permissions[permission.id] = permission;
}

export function addRole(role: TRole) {
    if (internals.roles[role.id]) {
        alert(`Role with id ${ role.id } already exists.`);
        return;
    }

    internals.roles[role.id] = role;
}

function initInternals() {
    const permissionManage = createPermission({ id: "manage", label: "Manage" });
    const permissionWrite = createPermission({ id: "write", label: "Write" });
    const permissionRead = createPermission({ id: "read", label: "Read" });

    addPermission(permissionManage);
    addPermission(permissionWrite);
    addPermission(permissionRead);

    const roleAdmin = createRole({ id: "admin", label: "Admin" });
    const roleUser = createRole({ id: "user", label: "User" });
    const roleAnonymous = createRole({ id: "anonymous", label: "Anonymous" });

    addPermissionsToRole(roleUser, [permissionRead]);
    addPermissionsToRole(roleAdmin, [permissionRead, permissionWrite, permissionManage]);

    addRole(roleAdmin);
    addRole(roleUser);
    addRole(roleAnonymous);
}

initInternals();
