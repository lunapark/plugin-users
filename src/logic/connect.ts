import { httpError } from "@luna-park/http-errors";

import type { TUser } from "@/files/database/users.ts";
import { authLogin, createUserSession, passwordLogin } from "@/logic/login.ts";
import { authSignup, createPasswordUser } from "@/logic/signup.ts";

export async function passwordConnect(login: string, password: string, mode: "login" | "signup" | "both") {
    let user: TUser;

    switch (mode) {
        case "login":
            user = await passwordLogin(login, password);
            break;
        case "both":
            user = await passwordLogin(login, password, true);
            break;
        case "signup":
            user = await createPasswordUser(login, password);
            break;
    }

    if (!user) {
        throw httpError.InternalServerError("Can't connect to provider.");
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
