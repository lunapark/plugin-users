import { EIdentifierType, type TGeneralSettings } from "@/internals/general.ts";
import type { TMailSettings } from "@/internals/mail.ts";
import type { TProvider } from "@/internals/providers.ts";
import { addPermissionsToRole, createPermission, createRole, type TPermission, type TRole } from "@/internals/roles.ts";

export type TInternals = {
    general: TGeneralSettings;
    mail: TMailSettings;
    permissions: Record<string, TPermission>;
    providers: Record<string, TProvider>;
    roles: Record<string, TRole>;
};

export const internals: TInternals = {
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
};

export function addPermission(permission: TPermission) {
    internals.permissions[permission.id] = permission;
}

export function addRole(role: TRole) {
    internals.roles[role.id] = role;
}

function initInternals() {
    const permissionAdmin = createPermission({ id: "admin", label: "Admin" });
    const permissionUser = createPermission({ id: "user", label: "User" });

    addPermission(permissionAdmin);
    addPermission(permissionUser);

    const roleAdmin = createRole({ id: "admin", label: "Admin" });
    const roleUser = createRole({ id: "user", label: "User" });
    const roleAnonymous = createRole({ id: "anonymous", label: "Anonymous" });

    addPermissionsToRole(roleUser, [permissionUser]);
    addPermissionsToRole(roleAdmin, [permissionUser, permissionAdmin]);

    addRole(roleAdmin);
    addRole(roleUser);
    addRole(roleAnonymous);
}

initInternals();
