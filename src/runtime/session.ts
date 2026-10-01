import { httpError } from "@luna-park/http-errors";

import type { TPublicUser, TUserRecord } from "@/runtime/config.ts";
import { ECookiesKey, getRuntime } from "@/runtime/config.ts";
import { generateHexToken, hashToken } from "@/runtime/hash.ts";

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

    await db.sessions.insert({ expires: new Date(Date.now() + sessionDuration), token: await hashToken(token), user: user.id });

    cookies.set(ECookiesKey.Session, token);

    return toPublicUser(user);
}

async function getValidSession(token: string) {
    const { db } = getRuntime();
    const tokenHash = await hashToken(token);
    const session = (await db.sessions.find({ token: tokenHash }))[0];

    if (!session) {
        throw httpError.Unauthorized("Invalid session.");
    }

    if (new Date(session.expires).getTime() < Date.now()) {
        await db.sessions.delete({ token: tokenHash });
        throw httpError.Unauthorized("Session expired.");
    }

    return session;
}

async function getCurrentSession() {
    const token = getRuntime().cookies.get(ECookiesKey.Session);
    return token ? await getValidSession(token).catch(() => undefined) : undefined;
}

export async function requireCurrentSession() {
    const session = await getCurrentSession();

    if (!session) {
        throw httpError.Unauthorized("You must be logged in to perform this action.");
    }

    return session;
}

export async function requireCurrentUser() {
    const { db } = getRuntime();
    const session = await requireCurrentSession();
    const user = (await db.users.find({ id: session.user }))[0];

    if (!user) {
        throw httpError.Unauthorized("You must be logged in to perform this action.");
    }

    return { session, user };
}

export async function resolveUser(): Promise<TPublicUser> {
    const { db } = getRuntime();
    const session = await getCurrentSession();

    if (!session) {
        return anonymousUser;
    }

    const user = (await db.users.find({ id: session.user }))[0];
    return user ? toPublicUser(user) : anonymousUser;
}

export async function disconnect(mode: "logout" | "all") {
    const { cookies, db } = getRuntime();
    const session = await getCurrentSession();

    if (session) {
        await db.sessions.delete(mode === "all" ? { user: session.user } : { id: session.id });
    }

    cookies.clear(ECookiesKey.Session);
}

function toIsoDate(value?: Date | string | number) {
    return value ? new Date(value).toISOString() : "";
}

export async function listSessions() {
    const { db } = getRuntime();
    const current = await requireCurrentSession();
    const sessions = await db.sessions.find({ user: current.user });

    return sessions
        .filter((session) => new Date(session.expires).getTime() >= Date.now())
        .map((session) => ({
            id: session.id,
            created: toIsoDate(session.created_at),
            current: session.id === current.id,
            expires: toIsoDate(session.expires)
        }));
}

export async function revokeSession(sessionId: string) {
    const { cookies, db } = getRuntime();
    const current = await requireCurrentSession();

    await db.sessions.delete({ id: sessionId, user: current.user });

    if (sessionId === current.id) {
        cookies.clear(ECookiesKey.Session);
    }
}
