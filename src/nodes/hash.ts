/* eslint-disable sort-keys-custom-order/object-keys */
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
        methods: {
            async in_exec() {
                const salt = new Uint8Array(64);
                crypto.getRandomValues(salt);

                this.out_hash = await argon2id({
                    password: this.in_password,
                    salt,
                    parallelism: this.config.parallelism,
                    iterations: this.config.iterations,
                    memorySize: this.config.memory,
                    hashLength: this.config.hashLength,
                    outputType: "encoded"
                });
                await this.out_exec();
            }
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        config: {
            parallelism: LogicType.number({ default: 1 }),
            iterations: LogicType.number({ default: 256 }),
            memory: LogicType.number({ default: 2048 }),
            hashLength: LogicType.number({ default: 64 })
        }
    }),
    makeLogicNode({
        name: "hash/verify-argon2",
        inputs: {
            in_exec: LogicType.exec(),
            in_password: LogicType.string({ name: "password" }),
            in_hash: LogicType.string({ name: "hash" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_verified: LogicType.boolean({ name: "verified" })
        },
        methods: {
            async in_exec() {
                const salt = new Uint8Array(64);
                crypto.getRandomValues(salt);

                this.out_verified = await argon2Verify({
                    password: this.in_password,
                    hash: this.in_hash
                });
                await this.out_exec();
            }
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        }
    })
];
