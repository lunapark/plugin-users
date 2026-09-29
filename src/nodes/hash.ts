import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { serverTarget } from "@/nodes/user.ts";
import { hashPassword, verifyPassword } from "@/runtime/hash.ts";

export default [
    makeLogicNode({
        name: "hash/hash-argon2",
        inputs: {
            in_exec: LogicType.exec(),
            in_password: LogicType.string({ name: "password" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_hash: LogicType.string({ name: "hash" })
        },
        config: {
            hashLength: LogicType.number({ default: 64 }),
            iterations: LogicType.number({ default: 256 }),
            memory: LogicType.number({ default: 2048 }),
            parallelism: LogicType.number({ default: 1 })
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        methods: {
            async in_exec() {
                this.out_hash = await hashPassword(this.in_password, this.config);
                await this.out_exec();
            }
        },
        build: {
            generate: ({ config }) => `async function () {
                this.out_hash = await hashPassword(this.in_password, ${ JSON.stringify({
                    hashLength: config?.hashLength ?? 64,
                    iterations: config?.iterations ?? 256,
                    memory: config?.memory ?? 2048,
                    parallelism: config?.parallelism ?? 1
                }) });
                await this.out_exec();
            }`,
            imports: [{ name: "hashPassword", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "hash/verify-argon2",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_password: LogicType.string({ name: "password" }),
            in_hash: LogicType.string({ name: "hash" })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_verified: LogicType.boolean({ name: "verified" })
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        methods: {
            async in_exec() {
                this.out_verified = await verifyPassword(this.in_password, this.in_hash);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_verified = await verifyPassword(this.in_password, this.in_hash);
                await this.out_exec();
            }`,
            imports: [{ name: "verifyPassword", target: serverTarget }]
        }
    })
];
