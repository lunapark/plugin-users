import { LogicType, makeLogicNode } from "@luna-park/plugin";

import { connect } from "@/logic/connect.ts";
import { disconnect } from "@/logic/disconnect.ts";

export default [
    makeLogicNode({
        name: "user/connect",
        inputs: {
            in_exec: LogicType.exec(),
            in_login: LogicType.string({ name: "Login" }),
            in_password: LogicType.string({ name: "Password" })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            async in_exec() {
                await connect(this.in_login, this.in_password);
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
