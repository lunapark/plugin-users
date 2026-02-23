import { database } from "@/env.ts";
import type { TUser } from "@/files/database/users.ts";

export async function getUser(userId: string) {
    return await database.sessions!.db.findById(userId) as TUser | undefined;
}
