import { httpError } from "@luna-park/http-errors";
import { type TFileStore } from "@luna-park/plugin";

import { database, env } from "@/env.ts";
import type { TUser } from "@/files/database/users.ts";
import { internals } from "@/internals";
import { ECookiesKey } from "@/logic/cookies.ts";
import { getIdentity } from "@/logic/identity.ts";
import { createSession } from "@/logic/session.ts";
import { createAuthUser } from "@/logic/signup.ts";

export async function authLogin(providerId: string, code: string, signup?: boolean) {
    const provider = internals.providers[providerId]?.data.development;

    if (!provider) {
        throw new Error(`Provider ${ providerId } not found.`);
    }

    const { id, value } = await getIdentity(provider, code);

    try {
        return await findAuthUser(providerId, id);
    }
    catch (error) {
        if (signup) {
            return await createAuthUser(providerId, { id, value });
        }
        else {
            throw error;
        }
    }
}

async function findAuthUser(providerId: string, id: string) {
    if (!id) {
        throw httpError.InternalServerError("Can't find identity information in authentication response.");
    }

    const user = await database.users!.db.find({ auth: { [providerId]: id } })[0];

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    return user as TUser;
}

export async function createUserSession(user: TUser) {
    const session = await createSession(user.id);

    env.backend.cookies[ECookiesKey.Session] = { value: session.token };
    env.backend.cookies[ECookiesKey.User] = { value: user.id };

    const userStore = env.getFile(internals.files["user-store"]!) as TFileStore;
    userStore.value.isConnected = true;
    userStore.value.user = {
        id: user.id,
        login: user.login,
        roles: user.roles
    };
}
