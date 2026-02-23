import { type TFileStore } from "@luna-park/plugin";

import { env } from "@/env.ts";
import { internals } from "@/internals";
import { ECookiesKey } from "@/logic/cookies.ts";
import { deleteSession } from "@/logic/session.ts";

export async function disconnect() {
    const sessionCookie = env.backend.cookies[ECookiesKey.Session]?.value;
    const userCookie = env.backend.cookies[ECookiesKey.User]?.value;

    if (sessionCookie && userCookie) {
        await deleteSession(userCookie, sessionCookie);
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
