import { httpError } from "@luna-park/http-errors";

import { ECookiesKey, getRuntime } from "@/runtime/config.ts";
import { lockUserWrites } from "@/runtime/connect.ts";
import { hashPassword, safeEqual, signData, verifyPassword } from "@/runtime/hash.ts";
import { requireCurrentSession, requireCurrentUser, toPublicUser } from "@/runtime/session.ts";
import { assertValidPassword } from "@/runtime/validation.ts";

const resetTokenDuration = 1000 * 60 * 60;

export async function changePassword(currentPassword: string, newPassword: string) {
    const { db } = getRuntime();
    const { session, user } = await requireCurrentUser();

    if (user.password && !await verifyPassword(currentPassword, user.password)) {
        throw httpError.Unauthorized("Invalid password.");
    }

    assertValidPassword(newPassword);
    await db.users.update({ id: user.id }, { password: await hashPassword(newPassword) });

    const sessions = await db.sessions.find({ user: user.id });
    await Promise.all(sessions.filter(({ id }) => id !== session.id).map(({ id }) => db.sessions.delete({ id })));
}

async function getResetSignature(userId: string, expires: string, passwordHash = "") {
    return await signData(getRuntime().secret, `password-reset.${ userId }.${ expires }.${ passwordHash }`);
}

export async function createPasswordResetToken(login: string) {
    const { db } = getRuntime();
    const user = (await db.users.find({ login: login.trim() }))[0];

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    const expires = String(Date.now() + resetTokenDuration);

    return {
        token: `${ user.id }.${ expires }.${ await getResetSignature(user.id, expires, user.password) }`,
        user: toPublicUser(user)
    };
}

export async function resetPassword(token: string, password: string) {
    const { db } = getRuntime();
    const [userId = "", expires = "", signature = ""] = token.split(".");
    const user = userId ? (await db.users.find({ id: userId }))[0] : undefined;

    if (!user || !safeEqual(signature, await getResetSignature(userId, expires, user.password))) {
        throw httpError.BadRequest("Invalid password reset token.");
    }

    if (Number(expires) < Date.now()) {
        throw httpError.BadRequest("Password reset token expired.");
    }

    assertValidPassword(password);
    await db.users.update({ id: user.id }, { password: await hashPassword(password) });
    await db.sessions.delete({ user: user.id });

    return toPublicUser(user);
}

export async function deleteUser(userId: string) {
    const { cookies, db } = getRuntime();
    const user = (await db.users.find({ id: userId }))[0];

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    const current = await requireCurrentSession().catch(() => undefined);

    await db.sessions.delete({ user: user.id });
    await db.users.delete({ id: user.id });

    if (current?.user === user.id) {
        cookies.clear(ECookiesKey.Session);
    }
}

export async function setRoles(userId: string, roles: Array<string>) {
    const { config, db } = getRuntime();
    const unknownRole = roles.find((role) => !config.roles[role]);

    if (unknownRole) {
        throw httpError.BadRequest(`Unknown role "${ unknownRole }".`);
    }

    return await lockUserWrites(async () => {
        const user = (await db.users.find({ id: userId }))[0];

        if (!user) {
            throw httpError.NotFound("User not found.");
        }

        const uniqueRoles = [...new Set(roles)];
        await db.users.update({ id: user.id }, { roles: uniqueRoles });

        return toPublicUser({ ...user, roles: uniqueRoles });
    });
}
