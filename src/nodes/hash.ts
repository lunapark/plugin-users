import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";
import { argon2id, argon2Verify } from "hash-wasm";

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
                const salt = new Uint8Array(64);
                crypto.getRandomValues(salt);

                this.out_hash = await argon2id({
                    hashLength: this.config.hashLength,
                    iterations: this.config.iterations,
                    memorySize: this.config.memory,
                    outputType: "encoded",
                    parallelism: this.config.parallelism,
                    password: this.in_password,
                    salt
                });
                await this.out_exec();
            }
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
                const salt = new Uint8Array(64);
                crypto.getRandomValues(salt);

                this.out_verified = await argon2Verify({
                    hash: this.in_hash,
                    password: this.in_password
                });
                await this.out_exec();
            }
        }
    })
];
