import type { TFileStore } from "@luna-park/plugin";

import { env } from "@/env.ts";
import { internals } from "@/internals";
import { ECookiesKey } from "@/logic/cookies.ts";
import { assertSessionValid, deleteAllSession, deleteSession } from "@/logic/session.ts";
import { getUser } from "@/logic/user.ts";

export async function disconnect(mode: "logout" | "all") {
    const sessionCookie = env.backend.cookies[ECookiesKey.Session]?.value;
    const userCookie = env.backend.cookies[ECookiesKey.User]?.value;

    if (sessionCookie && userCookie) {
        if (mode === "all") {
            const session = await assertSessionValid(userCookie, sessionCookie);
            const user = await getUser(session.user);
            if (user) {
                await deleteAllSession(user.id);
            }
        }
        else {
            await deleteSession(userCookie, sessionCookie);
        }
    }

    delete env.backend.cookies[ECookiesKey.Session];
    delete env.backend.cookies[ECookiesKey.User];

    const userStore = env.getFile(internals.files["user-store"]!) as TFileStore;
    userStore.value.isConnected = false;
    userStore.value.user = {
        id: "",
        login: "",
        roles: []
    };
}
