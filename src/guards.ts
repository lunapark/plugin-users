import type { TRouteGuard } from "@luna-park/plugin";
import { LogicType } from "@luna-park/plugin";

import { internals } from "@/internals";
import { serverTarget } from "@/nodes/user.ts";
import type { TPublicUser } from "@/runtime/config.ts";
import { assertAuthenticated, assertPermission } from "@/runtime/permission.ts";

export function getGuards(): Array<TRouteGuard> {
    return [
        {
            id: "authenticated",
            build: {
                generate: () => "async (request) => assertAuthenticated(request.context.in_user)",
                imports: [{ name: "assertAuthenticated", target: serverTarget }]
            },
            check: ({ context }) => assertAuthenticated(context.in_user as TPublicUser),
            description: "Only logged-in users can call this route.",
            label: "Authenticated"
        },
        {
            id: "permission",
            build: {
                generate: (config) => `async (request) => assertPermission(request.context.in_user, ${ JSON.stringify(config.permission) })`,
                imports: [{ name: "assertPermission", target: serverTarget }]
            },
            check: ({ config, context }) => assertPermission(context.in_user as TPublicUser, config.permission as string),
            config: LogicType.object({
                permission: LogicType.string({
                    name: "Permission",
                    enum: Object.fromEntries(Object.values(internals.permissions).map((permission) => [permission.id, permission.label]))
                })
            }),
            description: "Only users whose roles grant this permission can call this route.",
            label: "Permission"
        }
    ];
}
