import { httpError } from "@luna-park/http-errors";

import { EIdentifierType } from "@/internals/general.ts";
import { getRuntime } from "@/runtime/config.ts";
import { getPasswordError } from "@/runtime/password.ts";

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
    const error = getPasswordError(password, getRuntime().config.password);

    if (error) {
        throw httpError.BadRequest(error);
    }
}
