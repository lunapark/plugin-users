import hashNodes from "@/nodes/hash.ts";
import oauthNodes from "@/nodes/oauth.ts";
import passwordNodes from "@/nodes/password.ts";
import rolesNodes from "@/nodes/roles.ts";
import sessionsNodes from "@/nodes/sessions.ts";
import userNodes from "@/nodes/user.ts";

export const nodes = [
    ...hashNodes,
    ...rolesNodes,
    ...oauthNodes,
    ...userNodes,
    ...passwordNodes,
    ...sessionsNodes
];
