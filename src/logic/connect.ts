import { httpError } from "@luna-park/http-errors";
import { argon2Verify } from "hash-wasm";

import { database } from "@/env.ts";
import type { TUser } from "@/files/database/users.ts";
import { authLogin, createUserSession } from "@/logic/login.ts";
import { authSignup } from "@/logic/signup.ts";

export async function connect(login: string, password: string) {
    const user = await database.user!.db.find({ login })[0];

    if (!user) {
        throw httpError.NotFound("User not found.");
    }

    const valid = await argon2Verify({
        hash: user.password,
        password
    });

    if (!valid) {
        throw httpError.Unauthorized("Invalid password.");
    }

    await createUserSession(user);
}

export async function authConnect(providerId: string, code: string, mode: "login" | "signup" | "both") {
    let user: TUser;

    switch (mode) {
        case "login":
            user = await authLogin(providerId, code);
            break;
        case "both":
            user = await authLogin(providerId, code, true);
            break;
        case "signup":
            user = await authSignup(providerId, code);
            break;
    }

    if (!user) {
        throw httpError.InternalServerError("Can't connect to provider.");
    }

    await createUserSession(user);
}
