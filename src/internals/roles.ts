export type TRole = {
    id: string;
    freeze?: boolean;
    label: string;
    permissions: Array<string>;
};

export function createRole(role: Partial<TRole> = {}): TRole {
    return {
        id: crypto.randomUUID(),
        label: "New role",
        permissions: [],
        ...role
    };
}

export type TPermission = {
    id: string;
    label: string;
};

export function createPermission(permission: Partial<TPermission> = {}): TPermission {
    return {
        id: crypto.randomUUID(),
        label: "New permission",
        ...permission
    };
}

export function addPermissionsToRole(role: TRole, permissions: Array<TPermission>) {
    permissions.forEach((permission) => {
        role.permissions.push(permission.id);
    });
}
