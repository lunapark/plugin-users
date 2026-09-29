import { httpError } from "@luna-park/http-errors";
import { get } from "es-toolkit/compat";

import type { TProviderData } from "@/internals/providers.ts";
import type { TUserRecord } from "@/runtime/config.ts";
import { getRuntime } from "@/runtime/config.ts";
import { hashPassword, verifyPassword } from "@/runtime/hash.ts";
import { openSession } from "@/runtime/session.ts";

export type TConnectMode = "login" | "signup" | "both";

export async function passwordConnect(login: string, password: string, mode: TConnectMode) {
    const { db } = getRuntime();
    const user = (await db.users.find({ login }))[0];

    if (mode === "signup" || (mode === "both" && !user)) {
        return await openSession(await createPasswordUser(login, password));
    }

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    if (!user.password) {
        throw httpError.Unauthorized("User doesn't have a password.");
    }

    if (!await verifyPassword(password, user.password)) {
        throw httpError.Unauthorized("Invalid password.");
    }

    return await openSession(user);
}

async function createPasswordUser(login: string, password: string) {
    const { db } = getRuntime();

    if ((await db.users.find({ login }))[0]) {
        throw httpError.Conflict("User already exists with this login.");
    }

    return await db.users.insert({ login, password: await hashPassword(password), roles: ["user"] });
}

export async function authConnect(providerId: string, code: string, mode: TConnectMode) {
    const { config, db } = getRuntime();
    const provider = config.providers[providerId];

    if (!provider) {
        throw httpError.NotFound(`Provider ${ providerId } not found.`);
    }

    const identity = await getIdentity(provider, code);

    if (!identity.id || !identity.value) {
        throw httpError.InternalServerError("Can't find identity information in authentication response.");
    }

    const user = (await db.users.findByAuth(providerId, identity.id))[0];

    if (mode === "signup" || (mode === "both" && !user)) {
        return await openSession(await createAuthUser(providerId, identity));
    }

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    return await openSession(user);
}

async function createAuthUser(providerId: string, identity: { id: string; value: string; }): Promise<TUserRecord> {
    const { db } = getRuntime();

    if ((await db.users.find({ login: identity.value }))[0]) {
        throw httpError.Conflict("User already exists with this login.");
    }

    if ((await db.users.findByAuth(providerId, identity.id))[0]) {
        throw httpError.Conflict("User already exists with this provider.");
    }

    return await db.users.insert({ auth: { [providerId]: identity.id }, login: identity.value, roles: ["user"] });
}

async function getIdentity(provider: TProviderData, code: string) {
    const tokenResponse = await fetch(provider.url.token, {
        body: new URLSearchParams({
            client_id: provider.client.id,
            client_secret: provider.client.secret,
            code,
            grant_type: "authorization_code",
            redirect_uri: provider.url.redirect
        }).toString(),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });

    const { access_token } = await tokenResponse.json() as { access_token: string; };

    const identityResponse = await fetch(provider.api.url, {
        headers: {
            Authorization: `Bearer ${ access_token }`
        },
        method: "GET"
    });

    const identity = await identityResponse.json();

    return {
        id: String(get(identity, provider.api.id) ?? ""),
        value: String(get(identity, provider.api.value) ?? "")
    };
}
