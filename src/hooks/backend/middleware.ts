import { httpError } from "@luna-park/http-errors";
import { EPluginHooks, LogicType, type THookParams } from "@luna-park/plugin";

import { assertSessionValid } from "@/logic/session.ts";
import { getUser } from "@/logic/user.ts";

function getAnonymousUser() {
    return {
        id: "",
        login: "anonymous",
        roles: ["anonymous"]
    };
}

export async function backendMiddleware(params: THookParams[EPluginHooks.BackendMiddleware]) {
    const cookies = params.cookies;

    const sessionCookie = cookies["session"]?.value;
    const userCookie = cookies["user"]?.value;

    if (!sessionCookie || !userCookie) {
        params.setContextVar("in_user", getAnonymousUser());
        return;
    }

    try {
        const session = await assertSessionValid(userCookie, sessionCookie);
        const user = await getUser(session.user);

        if (!user) {
            throw httpError.InternalServerError("User not found.");
        }

        params.setContextVar("in_user", user);
    }
    catch (_error) {
        params.setContextVar("in_user", getAnonymousUser());
    }
}

export const middlewareUserSchema = LogicType.object({
    id: LogicType.string(),
    login: LogicType.string(),
    roles: LogicType.array(LogicType.string())
}, { name: "user" });
