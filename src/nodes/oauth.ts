import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { generateUserStoreUpdate, setUserStore } from "@/files/store/user.ts";
import { internals } from "@/internals";
import type { TConnectMode } from "@/runtime/connect.ts";
import { authConnect, authLink, getAuthorizationUrl } from "@/runtime/connect.ts";
import { generateHexToken } from "@/runtime/hash.ts";
import { requireCurrentSession } from "@/runtime/session.ts";

function getProviderInput() {
    return LogicType.string({
        name: "Provider",
        dynamic: () => LogicType.string({
            name: "Provider",
            enum: Object.fromEntries(Object.entries(internals.providers).map(([id, provider]) => [id, provider.label]))
        })
    });
}

function waitForOAuthCode(url: string, state: string) {
    return new Promise<string | undefined>((resolve) => {
        const popup = window.open(url, "_blank", "width=400,height=600");
        const listener = (event: MessageEvent) => {
            if (event.origin === window.location.origin && event.source === popup && event.data?.state === state) {
                finish(event.data.code);
            }
        };
        const interval = setInterval(() => {
            if (!popup || popup.closed) {
                finish();
            }
        }, 500);

        function finish(code?: string) {
            clearInterval(interval);
            window.removeEventListener("message", listener);
            resolve(code);
        }

        window.addEventListener("message", listener);
    });
}

async function requestOAuthCode(providerId: string) {
    const provider = internals.providers[providerId]?.data.development;

    if (!provider?.url.authorization) {
        throw new Error("OAuth provider is not configured.");
    }

    const state = generateHexToken(16);
    return await waitForOAuthCode(getAuthorizationUrl(provider, state), state);
}

function generateOAuthPopup(mode: string, output: string, onConnected = "") {
    return `async function () {
                const backend = new URL(import.meta.env.VITE_BACKEND_URL, window.location.origin);
                const url = new URL(backend.pathname.endsWith("/") ? "_users/oauth/start" : backend.pathname + "/_users/oauth/start", backend);
                url.searchParams.set("provider", this.in_provider);
                url.searchParams.set("mode", ${ mode });
                url.searchParams.set("origin", window.location.origin);
                const result = await new Promise((resolve) => {
                    const popup = window.open(url.href, "_blank", "width=400,height=600");
                    const listener = (event) => {
                        if (event.origin === url.origin && event.source === popup && event.data?.oauth) {
                            finish(event.data);
                        }
                    };
                    const interval = setInterval(() => {
                        if (!popup || popup.closed) {
                            finish({ oauth: "closed" });
                        }
                    }, 500);
                    function finish(result) {
                        clearInterval(interval);
                        window.removeEventListener("message", listener);
                        resolve(result);
                    }
                    window.addEventListener("message", listener);
                });
                if (result.oauth === "error") {
                    throw new Error(result.message ?? "OAuth connection failed.");
                }
                this.${ output } = result.oauth === "connected";
                if (this.${ output }) {
                    ${ onConnected }
                }
                await this.out_exec();
            }`;
}

export default (storeId: string) => [
    makeLogicNode({
        name: "oauth/connect",
        inputs: {
            in_exec: LogicType.exec(),
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_provider: getProviderInput(),
            in_mode: LogicType.string({ name: "Mode", default: "signup", enum: ["login", "signup", "both"] })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_connected: LogicType.boolean({ name: "connected" })
        },
        build: {
            generate: () => generateOAuthPopup("this.in_mode", "out_connected", generateUserStoreUpdate(storeId, "result.user"))
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        },
        methods: {
            async in_exec() {
                const code = await requestOAuthCode(this.in_provider);
                if (code) {
                    setUserStore(await authConnect(this.in_provider, code, this.in_mode as TConnectMode));
                }
                this.out_connected = !!code;
                await this.out_exec();
            }
        }
    }),
    makeLogicNode({
        name: "oauth/link",
        inputs: {
            in_exec: LogicType.exec(),
            in_provider: getProviderInput()
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_linked: LogicType.boolean({ name: "linked" })
        },
        build: {
            generate: () => generateOAuthPopup("\"link\"", "out_linked")
        },
        display: {
            config: {
                scope: ELogicScope.Frontend
            }
        },
        documentation: {
            description: "Link an OAuth provider account to the connected user, so they can also sign in with it."
        },
        methods: {
            async in_exec() {
                const session = await requireCurrentSession();
                const code = await requestOAuthCode(this.in_provider);
                if (code) {
                    await authLink(this.in_provider, code, session.user);
                }
                this.out_linked = !!code;
                await this.out_exec();
            }
        }
    })
];
