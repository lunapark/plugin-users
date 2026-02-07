/* eslint-disable sort-keys-custom-order/object-keys */
import { LogicType, makeLogicNode } from "@luna-park/plugin";

export default [
    makeLogicNode({
        name: "roles/has-right",
        inputs: {
            in_exec: LogicType.exec(),
            in_right: LogicType.string({ name: "right" }),
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
        name: "roles/assert-right",
        inputs: {
            in_exec: LogicType.exec(),
            in_right: LogicType.string({ name: "right" }),
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
