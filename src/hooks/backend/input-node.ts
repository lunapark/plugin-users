import { EPluginHooks, type THookParams } from "@luna-park/plugin";

import { middlewareUserSchema } from "@/hooks/backend/middleware.ts";

export function backendInputNode(params: THookParams[EPluginHooks.BackendInputNode]) {
    params.addInput("in_user", { ...middlewareUserSchema, optional: true });
}
