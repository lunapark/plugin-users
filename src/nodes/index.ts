import type { TEnv } from "@luna-park/plugin";

import type { TConfig } from "@/config.ts";
import type { TInternals } from "@/internals";
import { getDefaultPasswordPolicy } from "@/internals/general.ts";
import hashNodes from "@/nodes/hash.ts";
import oauthNodes from "@/nodes/oauth.ts";
import passwordNodes from "@/nodes/password.ts";
import rolesNodes from "@/nodes/roles.ts";
import sessionsNodes from "@/nodes/sessions.ts";
import userNodes from "@/nodes/user.ts";

export function getNodes({ internals }: TEnv<TConfig, TInternals>) {
    return [
        ...hashNodes,
        ...rolesNodes,
        ...oauthNodes(internals.files["user-store"]),
        ...userNodes(internals.files["user-store"]),
        ...passwordNodes(internals.general.password ?? getDefaultPasswordPolicy()),
        ...sessionsNodes
    ];
}
