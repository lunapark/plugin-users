import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { serverTarget } from "@/nodes/user.ts";
import { listSessions, revokeSession } from "@/runtime/session.ts";

const sessionSchema = LogicType.object({
    id: LogicType.string(),
    created: LogicType.string(),
    current: LogicType.boolean(),
    expires: LogicType.string()
}, { name: "session" });

export default [
    makeLogicNode({
        name: "user/list-sessions",
        inputs: {
            in_exec: LogicType.exec()
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_sessions: LogicType.array(sessionSchema, { name: "sessions" })
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "List the active sessions (devices) of the connected user."
        },
        methods: {
            async in_exec() {
                this.out_sessions = await listSessions();
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_sessions = await listSessions();
                await this.out_exec();
            }`,
            imports: [{ name: "listSessions", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "user/revoke-session",
        inputs: {
            in_exec: LogicType.exec(),
            in_session: LogicType.string({ name: "Session id" })
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
            description: "Log out one of the connected user's sessions."
        },
        methods: {
            async in_exec() {
                await revokeSession(this.in_session);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                await revokeSession(this.in_session);
                await this.out_exec();
            }`,
            imports: [{ name: "revokeSession", target: serverTarget }]
        }
    })
];
