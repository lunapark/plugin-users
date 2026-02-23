import { httpError } from "@luna-park/http-errors";

import { database } from "@/env.ts";
import type { TUser } from "@/files/database/users.ts";
import { internals } from "@/internals";
import { getIdentity } from "@/logic/identity.ts";

export async function authSignup(providerId: string, code: string) {
    const provider = internals.providers[providerId]?.data.development;

    if (!provider) {
        throw new Error(`Provider ${ providerId } not found.`);
    }

    const { id, value } = await getIdentity(provider, code);

    return await createAuthUser(providerId, { id, value });
}

export async function createAuthUser(providerId: string, user: { id: string; value: string; }) {
    if (!user.id || !user.value) {
        throw httpError.InternalServerError("Can't find identity information in authentication response.");
    }

    const existingUser = await database.users!.db.find({
        login: user.value
    })[0];

    if (existingUser) {
        throw httpError.Conflict("User already exists.");
    }

    return (await database.users!.db.insert({
        auth: {
            [providerId]: user.id
        },
        login: user.value,
        roles: ["user"]
    })) as TUser;
}
