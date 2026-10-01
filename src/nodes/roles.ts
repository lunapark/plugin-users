import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { middlewareUserSchema } from "@/hooks/backend/middleware.ts";
import { internals } from "@/internals";
import { serverTarget } from "@/nodes/user.ts";
import { setRoles } from "@/runtime/account.ts";
import { assertPermission, hasPermission } from "@/runtime/permission.ts";

function getPermissionInput() {
    return LogicType.string({
        name: "Permission",
        dynamic: () => LogicType.string({
            name: "Permission",
            enum: Object.fromEntries(Object.entries(internals.permissions).map(([id, permission]) => [id, permission.label]))
        })
    });
}

export default [
    makeLogicNode({
        name: "roles/has-permission",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_user: middlewareUserSchema,
            in_permission: getPermissionInput()
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
            async in_exec() {
                this.out_valid = hasPermission(this.in_user, this.in_permission);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_valid = hasPermission(this.in_user, this.in_permission);
                await this.out_exec();
            }`,
            imports: [{ name: "hasPermission", target: serverTarget }]
        }
    }),

    makeLogicNode({
        name: "roles/assert-permission",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_user: middlewareUserSchema,
            in_permission: getPermissionInput()
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
            async in_exec() {
                assertPermission(this.in_user, this.in_permission);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                assertPermission(this.in_user, this.in_permission);
                await this.out_exec();
            }`,
            imports: [{ name: "assertPermission", target: serverTarget }]
        }
    }),

    makeLogicNode({
        name: "roles/set-roles",
        inputs: {
            in_exec: LogicType.exec(),
            in_id: LogicType.string({ name: "User id" }),
            in_roles: LogicType.array(LogicType.string(), { name: "Roles" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_user: middlewareUserSchema
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "Replace a user's roles. Every role must exist in the plugin settings."
        },
        methods: {
            async in_exec() {
                this.out_user = await setRoles(this.in_id, this.in_roles);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_user = await setRoles(this.in_id, this.in_roles);
                await this.out_exec();
            }`,
            imports: [{ name: "setRoles", target: serverTarget }]
        }
    })
];
