import { type TFileStore } from "@luna-park/plugin";

import { env } from "@/env.ts";
import { internals } from "@/internals";
import { deleteSession } from "@/logic/session.ts";

export async function disconnect() {
    const sessionCookie = env.backend.cookies["session"]?.value;
    const userCookie = env.backend.cookies["user"]?.value;

    if (sessionCookie && userCookie) {
        await deleteSession(userCookie, sessionCookie);
    }

    delete env.backend.cookies["session"];
    delete env.backend.cookies["user"];

    const userStore = env.getFile(internals.files["user-store"]!) as TFileStore;
    userStore.value.isConnected = true;
    userStore.value.user = {
        id: "",
        login: "",
        roles: []
    };
}
