/* eslint-disable sort-keys-custom-order/object-keys */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/internals";

export default [
    makeLogicNode({
        name: "roles/has-permission",
        inputs: {
            in_exec: LogicType.exec(),
            in_permission: LogicType.string({
                name: "Permission",
                dynamic: () => LogicType.string({
                    name: "Permission",
                    enum: Object.fromEntries(Object.entries(internals.permissions).map(([id, permission]) => [id, permission.label]))
                })
            })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_valid: LogicType.boolean({ name: "valid" })
        },
        methods: {
            async in_exec() {
            }
        }
    }),

    makeLogicNode({
        name: "roles/assert-permission",
        inputs: {
            in_exec: LogicType.exec(),
            in_permission: LogicType.string({
                name: "Permission",
                dynamic: () => LogicType.string({
                    name: "Permission",
                    enum: Object.fromEntries(Object.entries(internals.permissions).map(([id, permission]) => [id, permission.label]))
                })
            })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            async in_exec() {
            }
        }
    })
];
