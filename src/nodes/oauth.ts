/* eslint-disable sort-keys-custom-order/object-keys */
import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/internals";

export default [
    makeLogicNode({
        name: "oauth/connect",
        inputs: {
            in_exec: LogicType.exec(),
            in_provider: LogicType.string({
                name: "Provider",
                dynamic: () => LogicType.string({
                    name: "Provider",
                    enum: Object.fromEntries(Object.entries(internals.providers).map(([id, provider]) => [id, provider.label]))
                })
            }),
            in_mode: LogicType.string({ name: "Mode", enum: ["login", "register"] })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        methods: {
            in_exec() {
                const target = internals.providers[this.in_provider]?.data.development.target.url;

                if (target) {
                    const listener = async (event: MessageEvent) => {
                        if (event.data.code) {
                            await this.out_exec();
                            window.removeEventListener("message", listener);
                        }
                    };

                    window.open(target, "_blank", "width=400,height=600");
                    window.addEventListener("message", listener);
                }
            }
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        }
    })
];
