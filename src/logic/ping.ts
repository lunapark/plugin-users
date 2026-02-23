import type { TFileStore } from "@luna-park/plugin";

import { env } from "@/env.ts";
import { internals } from "@/internals";
import { ECookiesKey } from "@/logic/cookies.ts";
import { assertSessionValid } from "@/logic/session.ts";
import { getUser } from "@/logic/user.ts";

export async function ping() {
    const sessionCookie = env.backend.cookies[ECookiesKey.Session]?.value;
    const userCookie = env.backend.cookies[ECookiesKey.User]?.value;

    if (!sessionCookie || !userCookie) {
        return;
    }

    try {
        const session = await assertSessionValid(userCookie, sessionCookie);
        const user = await getUser(session.user);

        if (user) {
            const userStore = env.getFile(internals.files["user-store"]!) as TFileStore;
            userStore.value.isConnected = true;
            userStore.value.user = {
                id: user.id,
                login: user.login,
                roles: user.roles
            };
        }
    }
    catch (_error) {
    }
}
