import { EPluginHooks } from "@luna-park/plugin";

import { backendInputNode } from "@/hooks/backend/input-node.ts";
import { backendMiddleware } from "@/hooks/backend/middleware.ts";

export const hooks = {
    [EPluginHooks.BackendMiddleware]: backendMiddleware,
    [EPluginHooks.BackendInputNode]: backendInputNode
};
