import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/internals";
import { authConnect } from "@/logic/connect.ts";

export default [
    makeLogicNode({
        name: "oauth/connect",
        inputs: {
            in_exec: LogicType.exec(),
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_provider: LogicType.string({
                name: "Provider",
                dynamic: () => LogicType.string({
                    name: "Provider",
                    enum: Object.fromEntries(Object.entries(internals.providers).map(([id, provider]) => [id, provider.label]))
                })
            }),
            in_mode: LogicType.string({ name: "Mode", enum: ["login", "signup", "both"], default: "both" })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        },
        methods: {
            in_exec() {
                const target = internals.providers[this.in_provider]?.data.development.url.authorization;

                if (target) {
                    const listener = async (event: MessageEvent) => {
                        if (event.data.code) {
                            window.removeEventListener("message", listener);
                            await authConnect(this.in_provider, event.data.code, this.in_mode);
                            await this.out_exec();
                        }
                    };

                    const childWindow = window.open(target, "_blank", "width=400,height=600");
                    window.addEventListener("message", listener);

                    childWindow!.addEventListener("beforeunload", () => window.removeEventListener("message", listener));
                }
            }
        }
    })
];
