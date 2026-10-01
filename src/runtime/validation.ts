import { httpError } from "@luna-park/http-errors";

import { EIdentifierType } from "@/internals/general.ts";
import { getRuntime } from "@/runtime/config.ts";

const minPasswordLength = 8;

export function assertValidLogin(login: string) {
    const { config } = getRuntime();

    if (!login) {
        throw httpError.BadRequest("Login is required.");
    }

    if (config.identifier === EIdentifierType.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
        throw httpError.BadRequest("Login must be a valid email address.");
    }
}

export function assertValidPassword(password: string) {
    if (password.length < minPasswordLength) {
        throw httpError.BadRequest(`Password must be at least ${ minPasswordLength } characters long.`);
    }
}
