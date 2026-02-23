import { httpError } from "@luna-park/http-errors";

import { database } from "@/env.ts";
import type { TSession } from "@/files/database/sessions.ts";
import { generateHexToken } from "@/logic/utils.ts";

export async function createSession(userId: string): Promise<TSession> {
    const token = generateHexToken();

    return await database.sessions!.db.insert({
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 year
        token,
        user: userId
    });
}

export async function getSession(userId: string, token: string) {
    return await database.sessions!.db.find({ token, user: userId })[0] as TSession | undefined;
}

export async function assertSessionValid(userId: string, token: string) {
    const session = await getSession(userId, token);
    if (!session) {
        throw httpError.Unauthorized("Invalid session.");
    }

    if (session.expires < Date.now()) {
        await deleteSession(userId, token);
        throw httpError.Unauthorized("Session expired.");
    }

    return session as TSession;
}

export async function deleteSession(userId: string, token: string) {
    return await database.sessions!.db.delete({ token, user: userId });
}
