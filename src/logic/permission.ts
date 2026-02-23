import { internals } from "@/internals";

export function getPermissionsFromRoles(roles: Array<string>) {
    const permissions = new Set<string>();

    for (const roleId of roles) {
        const role = internals.roles[roleId];

        if (!role) {
            continue;
        }

        for (const permissionId of role.permissions) {
            permissions.add(permissionId);
        }
    }

    return [...permissions];
}
