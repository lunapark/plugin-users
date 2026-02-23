import type { TProviderData } from "@/internals/providers.ts";

export type TOAuthResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
};

export async function getAuth(provider: TProviderData, code: string) {
    const response = await fetch(provider.url.token, {
        body: new URLSearchParams({
            client_id: provider.client.id,
            client_secret: provider.client.secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: provider.url.redirect
        }).toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });

    return await response.json() as TOAuthResponse;
}
