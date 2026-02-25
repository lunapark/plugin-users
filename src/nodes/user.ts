import { LogicType, makeLogicNode } from "@luna-park/plugin";

import { passwordConnect } from "@/logic/connect.ts";
import { disconnect } from "@/logic/disconnect.ts";

export default [
    makeLogicNode({
        name: "user/connect",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_login: LogicType.string({ name: "Login" }),
            in_password: LogicType.string({ name: "Password" }),
            in_mode: LogicType.string({ name: "Mode", default: "login", enum: ["login", "signup", "both"] })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            async in_exec() {
                await passwordConnect(this.in_login, this.in_password, this.in_mode);
                await this.out_exec();
            }
        }
    }),
    makeLogicNode({
        name: "user/disconnect",
        inputs: {
            in_exec: LogicType.exec()
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            async in_exec() {
                await disconnect();
                await this.out_exec();
            }
        }
    })
];
