import { httpError } from "@luna-park/http-errors";
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { middlewareUserSchema } from "@/hooks/backend/middleware.ts";
import { internals } from "@/internals";
import { getPermissionsFromRoles } from "@/logic/permission.ts";

export default [
    makeLogicNode({
        name: "roles/has-permission",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_user: middlewareUserSchema,
            in_permission: LogicType.string({
                name: "Permission",
                dynamic: () => LogicType.string({
                    name: "Permission",
                    enum: Object.fromEntries(Object.entries(internals.permissions).map(([id, permission]) => [id, permission.label]))
                })
            })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_valid: LogicType.boolean({ name: "valid" })
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        methods: {
            in_exec() {
                const permissions = getPermissionsFromRoles(this.in_user.roles);
                this.out_valid = permissions.includes(this.in_permission);

                return this.out_exec();
            }
        }
    }),

    makeLogicNode({
        name: "roles/assert-permission",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_user: middlewareUserSchema,
            in_permission: LogicType.string({
                name: "Permission",
                dynamic: () => LogicType.string({
                    name: "Permission",
                    enum: Object.fromEntries(Object.entries(internals.permissions).map(([id, permission]) => [id, permission.label]))
                })
            })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        methods: {
            in_exec() {
                const permissions = getPermissionsFromRoles(this.in_user.roles);
                if (!permissions.includes(this.in_permission)) {
                    throw httpError.Forbidden("User doesn't have permission to perform this action.");
                }

                return this.out_exec();
            }
        }
    })
];
