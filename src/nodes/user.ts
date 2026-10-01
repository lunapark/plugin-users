import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { middlewareUserSchema } from "@/hooks/backend/middleware.ts";
import { deleteUser } from "@/runtime/account.ts";
import type { TConnectMode } from "@/runtime/connect.ts";
import { passwordConnect } from "@/runtime/connect.ts";
import { disconnect, resolveUser } from "@/runtime/session.ts";

export const serverTarget = "@luna-park/plugin-users/server";

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
            out_exec: LogicType.exec(),
            out_user: middlewareUserSchema
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        methods: {
            async in_exec() {
                this.out_user = await passwordConnect(this.in_login, this.in_password, this.in_mode as TConnectMode);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_user = await passwordConnect(this.in_login, this.in_password, this.in_mode);
                await this.out_exec();
            }`,
            imports: [{ name: "passwordConnect", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "user/disconnect",
        inputs: {
            in_exec: LogicType.exec(),
            in_mode: LogicType.string({ name: "Mode", default: "logout", enum: ["logout", "all"] })
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
                await disconnect(this.in_mode as "logout" | "all");
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                await disconnect(this.in_mode);
                await this.out_exec();
            }`,
            imports: [{ name: "disconnect", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "user/current",
        inputs: {
            in_exec: LogicType.exec()
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_connected: LogicType.boolean({ name: "connected" }),
            out_user: middlewareUserSchema
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            description: "Fetch the user connected in this browser."
        },
        methods: {
            async in_exec() {
                this.out_user = await resolveUser();
                this.out_connected = !!this.out_user.id;
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_user = await route({ method: "get", url: "/_users/me" });
                this.out_connected = !!this.out_user.id;
                await this.out_exec();
            }`,
            imports: [{ name: "route", target: "@/utils/api" }]
        }
    }),
    makeLogicNode({
        name: "user/delete",
        inputs: {
            in_exec: LogicType.exec(),
            in_id: LogicType.string({ name: "User id" })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "Delete a user and all their sessions."
        },
        methods: {
            async in_exec() {
                await deleteUser(this.in_id);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                await deleteUser(this.in_id);
                await this.out_exec();
            }`,
            imports: [{ name: "deleteUser", target: serverTarget }]
        }
    })
];
