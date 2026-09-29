import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { internals } from "@/internals";
import type { TConnectMode } from "@/runtime/connect.ts";
import { authConnect } from "@/runtime/connect.ts";

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
            in_mode: LogicType.string({ name: "Mode", default: "signup", enum: ["login", "signup", "both"] })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_connected: LogicType.boolean({ name: "connected" })
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        },
        methods: {
            async in_exec() {
                const target = internals.providers[this.in_provider]?.data.development.url.authorization;

                if (target) {
                    const listener = async (event: MessageEvent) => {
                        if (event.data.code) {
                            window.removeEventListener("message", listener);
                            await authConnect(this.in_provider, event.data.code, this.in_mode as TConnectMode);
                            this.out_connected = true;
                            await this.out_exec();
                        }
                    };

                    const childWindow = window.open(target, "_blank", "width=400,height=600");
                    window.addEventListener("message", listener);

                    childWindow!.addEventListener("beforeunload", () => window.removeEventListener("message", listener));
                }
            }
        },
        build: {
            generate: () => `async function () {
                const url = new URL(new URL(import.meta.env.VITE_BACKEND_URL, window.location.origin).href + "/_users/oauth/start");
                url.searchParams.set("provider", this.in_provider);
                url.searchParams.set("mode", this.in_mode);
                const status = await new Promise((resolve) => {
                    const popup = window.open(url.href, "_blank", "width=400,height=600");
                    const listener = (event) => {
                        if (event.data?.oauth) {
                            finish(event.data.oauth);
                        }
                    };
                    const interval = setInterval(() => {
                        if (!popup || popup.closed) {
                            finish("closed");
                        }
                    }, 500);
                    function finish(result) {
                        clearInterval(interval);
                        window.removeEventListener("message", listener);
                        resolve(result);
                    }
                    window.addEventListener("message", listener);
                });
                this.out_connected = status === "connected";
                await this.out_exec();
            }`
        }
    })
];
