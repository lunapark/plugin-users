import { get } from "es-toolkit/compat";

import type { TProviderData } from "@/internals/providers.ts";
import { getAuth } from "@/logic/oauth.ts";

export async function getIdentity(provider: TProviderData, code: string) {
    const auth = await getAuth(provider, code);
    const token = auth.access_token;

    const identityResponse = await fetch(provider.api.url, {
        headers: {
            Authorization: `Bearer ${ token }`
        },
        method: "GET"
    });

    const identity = await identityResponse.json();

    const id = get(identity, provider.api.id);
    const value = get(identity, provider.api.value);

    return { id, value };
}
