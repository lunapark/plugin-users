import type { EPluginHooks, THookParams } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";

import { resolveUser } from "@/runtime/session.ts";

export async function backendMiddleware(params: THookParams[EPluginHooks.BackendMiddleware]) {
    params.setContextVar("in_user", await resolveUser());
}

export const middlewareUserSchema = LogicType.object({
    id: LogicType.string(),
    login: LogicType.string(),
    roles: LogicType.array(LogicType.string())
}, { name: "user" });
