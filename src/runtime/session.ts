import { httpError } from "@luna-park/http-errors";

import type { TPublicUser, TUserRecord } from "@/runtime/config.ts";
import { ECookiesKey, getRuntime } from "@/runtime/config.ts";
import { generateHexToken } from "@/runtime/hash.ts";

const sessionDuration = 1000 * 60 * 60 * 24 * 365;

export const anonymousUser: TPublicUser = {
    id: "",
    login: "anonymous",
    roles: ["anonymous"]
};

export function toPublicUser(user: TUserRecord): TPublicUser {
    return { id: user.id, login: user.login, roles: user.roles };
}

export async function openSession(user: TUserRecord) {
    const { cookies, db } = getRuntime();
    const token = generateHexToken();

    await db.sessions.insert({ expires: new Date(Date.now() + sessionDuration), token, user: user.id });

    cookies.set(ECookiesKey.Session, token);
    cookies.set(ECookiesKey.User, user.id);

    return toPublicUser(user);
}

async function getValidSession(userId: string, token: string) {
    const { db } = getRuntime();
    const session = (await db.sessions.find({ token, user: userId }))[0];

    if (!session) {
        throw httpError.Unauthorized("Invalid session.");
    }

    if (new Date(session.expires).getTime() < Date.now()) {
        await db.sessions.delete({ token, user: userId });
        throw httpError.Unauthorized("Session expired.");
    }

    return session;
}

export async function resolveUser(): Promise<TPublicUser> {
    const { cookies, db } = getRuntime();
    const token = cookies.get(ECookiesKey.Session);
    const userId = cookies.get(ECookiesKey.User);

    if (!token || !userId) {
        return anonymousUser;
    }

    try {
        const session = await getValidSession(userId, token);
        const user = (await db.users.find({ id: session.user }))[0];
        return user ? toPublicUser(user) : anonymousUser;
    }
    catch {
        return anonymousUser;
    }
}

export async function disconnect(mode: "logout" | "all") {
    const { cookies, db } = getRuntime();
    const token = cookies.get(ECookiesKey.Session);
    const userId = cookies.get(ECookiesKey.User);

    if (token && userId) {
        if (mode === "all") {
            await getValidSession(userId, token);
            await db.sessions.delete({ user: userId });
        }
        else {
            await db.sessions.delete({ token, user: userId });
        }
    }

    cookies.clear(ECookiesKey.Session);
    cookies.clear(ECookiesKey.User);
}
