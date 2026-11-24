import type { TEnv } from "@luna-park/plugin";
import { getPluginSecretEnvName } from "@luna-park/plugin";

import type { TConfig } from "@/config.ts";
import type { TInternals } from "@/internals";
import { getProviderSecretNames } from "@/internals/secrets.ts";

const environments = ["development", "production"] as const;

export async function migrateSecrets({ internals, secrets }: TEnv<TConfig, TInternals>) {
    for (const provider of Object.values(internals.providers)) {
        const names = getProviderSecretNames(provider.id);

        for (const environment of environments) {
            const { client } = provider.data[environment];

            if (client.secret && secrets?.available) {
                await secrets.set(names[environment], client.secret);
                delete client.secret;
            }
        }
    }
}

export function getLegacySecretEnv({ internals }: TEnv<TConfig, TInternals>) {
    return Object.fromEntries(Object.values(internals.providers).flatMap((provider) => {
        const names = getProviderSecretNames(provider.id);

        return environments
            .filter((environment) => provider.data[environment].client.secret)
            .map((environment) => [getPluginSecretEnvName("users", names[environment]), provider.data[environment].client.secret as string]);
    }));
}
