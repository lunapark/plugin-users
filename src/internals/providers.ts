import type { EIdentifierType } from "@/internals/general.ts";
import type { TProviderPreset } from "@/internals/presets.ts";

export const developmentRedirectUrl = "https://luna-park.app/plugin?plugin=@luna-park/plugin-users&window=OAuth";

export const productionRedirectUrl = "https://<your-domain>/api/_users/oauth/callback";

export type TProviderData = {
    api: {
        id: string;
        url: string;
        value: string;
    };
    client: {
        id: string;
        secret: string;
    };
    scope?: string;
    url: {
        authorization: string;
        redirect: string;
        token: string;
    };
};

export function createProviderData(preset?: TProviderPreset, identifier?: EIdentifierType): TProviderData {
    return {
        api: {
            id: preset?.api.id ?? "",
            url: preset?.api.url ?? "",
            value: (preset && identifier) ? preset.api.value[identifier] : ""
        },
        client: {
            id: "",
            secret: ""
        },
        scope: preset?.scope ?? "",
        url: {
            authorization: preset?.url.authorization ?? "",
            redirect: "",
            token: preset?.url.token ?? ""
        }
    };
}

export type TProvider = {
    id: string;
    data: {
        development: TProviderData;
        production: TProviderData;
    };
    label: string;
    preset?: string;
};

export function createProvider(preset?: TProviderPreset, identifier?: EIdentifierType): TProvider {
    const provider: TProvider = {
        id: crypto.randomUUID(),
        data: {
            development: createProviderData(preset, identifier),
            production: createProviderData(preset, identifier)
        },
        label: preset?.label ?? "New provider",
        preset: preset?.id
    };

    provider.data.development.url.redirect = developmentRedirectUrl;

    return provider;
}

export function resolveProductionData(provider: TProvider): TProviderData {
    const { development, production } = provider.data;

    return {
        api: {
            id: production.api.id || development.api.id,
            url: production.api.url || development.api.url,
            value: production.api.value || development.api.value
        },
        client: {
            id: production.client.id || development.client.id,
            secret: production.client.secret || development.client.secret
        },
        scope: production.scope || development.scope,
        url: {
            authorization: production.url.authorization || development.url.authorization,
            redirect: production.url.redirect,
            token: production.url.token || development.url.token
        }
    };
}

export function getMissingProductionFields(provider: TProvider) {
    const data = resolveProductionData(provider);
    const fields: Array<[string, string]> = [
        ["Client ID", data.client.id],
        ["Client secret", data.client.secret],
        ["Redirect URL", data.url.redirect],
        ["Authorization URL", data.url.authorization],
        ["Token URL", data.url.token],
        ["API target", data.api.url],
        ["API id path", data.api.id],
        ["API value path", data.api.value]
    ];

    return fields.filter(([, value]) => !value.trim()).map(([label]) => label);
}
