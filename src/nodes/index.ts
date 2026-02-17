import hashNodes from "@/nodes/hash.ts";
import oauthNodes from "@/nodes/oauth.ts";
import rolesNodes from "@/nodes/roles.ts";

export const nodes = [
    ...hashNodes,
    ...rolesNodes,
    ...oauthNodes
];
