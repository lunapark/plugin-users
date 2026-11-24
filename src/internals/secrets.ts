import type { Static } from "@luna-park/plugin";
import { upperSnakeCase } from "@luna-park/plugin";

import type { TConfig } from "@/config.ts";
import { secretNames } from "@/config.ts";
import { env } from "@/env.ts";
import { internals } from "@/internals";

export function getProviderSecretNames(providerId: string) {
    const key = upperSnakeCase(providerId);

    return {
        development: `${ secretNames.development }_${ key }`,
        production: `${ secretNames.production }_${ key }`
    };
}

export function syncProviderSecrets() {
    const config = env.config as Static<TConfig>;
    const ids = Object.keys(internals.providers);

    if (JSON.stringify(Object.keys(config.oauthProviders ?? {})) !== JSON.stringify(ids)) {
        config.oauthProviders = Object.fromEntries(ids.map((id) => [id, {}]));
    }
}

export async function removeProviderSecrets(providerId: string) {
    for (const name of Object.values(getProviderSecretNames(providerId))) {
        await env.secrets?.remove(name);
    }

    syncProviderSecrets();
}
