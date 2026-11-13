import { env } from "@/env.ts";
import { internals } from "@/internals";
import type { TProviderData } from "@/internals/providers.ts";
import { getAuthorizationUrl, getIdentity } from "@/runtime/connect.ts";
import { generateHexToken } from "@/runtime/hash.ts";

const loopbackState = /^[0-9a-f]{32}\.(\d{1,5})$/;

export function getLoopbackRedirect(search: string) {
    const params = new URLSearchParams(search);
    const port = loopbackState.exec(params.get("state") ?? "")?.[1];

    if (!port) {
        return;
    }

    const url = new URL(`http://127.0.0.1:${ port }/callback`);
    url.search = params.toString();
    return url.href;
}

function waitForPopupCode(url: string, state: string) {
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

async function waitForHostCode(provider: TProviderData, token: string) {
    let state = "";
    const params = await env.host!.authorize((callback) => {
        state = `${ token }.${ new URL(callback).port }`;
        return getAuthorizationUrl(provider, state);
    });

    if (params.get("state") !== state) {
        throw new Error("Invalid OAuth state.");
    }

    const code = params.get("code");

    if (!code) {
        throw new Error(params.get("error_description") ?? params.get("error") ?? "No code received from OAuth provider.");
    }

    return code;
}

export async function requestOAuthCode(providerId: string) {
    const provider = internals.providers[providerId]?.data.development;

    if (!provider?.url.authorization) {
        throw new Error("OAuth provider is not configured.");
    }

    const state = generateHexToken(16);

    if (env.host?.available) {
        return await waitForHostCode(provider, state);
    }

    return await waitForPopupCode(getAuthorizationUrl(provider, state), state);
}

export async function testOAuthConnection(providerId: string) {
    const code = await requestOAuthCode(providerId);

    if (!code) {
        return;
    }

    const identity = await getIdentity(internals.providers[providerId]!.data.development, code);

    if (!identity.id || !identity.value) {
        throw new Error("Connected, but the identity response has no id or value at the configured API paths.");
    }

    return identity;
}
