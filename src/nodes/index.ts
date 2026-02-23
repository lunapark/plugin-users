import hashNodes from "@/nodes/hash.ts";
import oauthNodes from "@/nodes/oauth.ts";
import rolesNodes from "@/nodes/roles.ts";
import userNodes from "@/nodes/user.ts";

export const nodes = [
    ...hashNodes,
    ...rolesNodes,
    ...oauthNodes,
    ...userNodes
];
