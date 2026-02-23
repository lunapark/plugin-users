import { faShield, faTowerControl } from "@fortawesome/pro-solid-svg-icons";
import { makePlugin } from "@luna-park/plugin";
import { shallowRef } from "vue";

import LGeneralSettings from "@/components/general/LGeneralSettings.vue";
import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
import LOAuthWindow from "@/components/windows/LOAuthWindow.vue";
import { env } from "@/env.ts";
import { initSessionsDatabase } from "@/files/database/sessions.ts";
import { initUsersDatabase } from "@/files/database/users.ts";
import { initUserStore } from "@/files/store/user.ts";
import { hooks } from "@/hooks";
import { internals } from "@/internals";
import icon from "@/logo.svg";
import { nodes } from "@/nodes";

export default makePlugin({
    description: "Add user accounts, connections, and roles.",
    editor: {
        nodes
    },
    hooks,
    icon,
    id: "users",
    internals,
    lifecycle: {
        mount: async ({ addFile, app, backend, getFile }) => {
            env.addFile = addFile;
            env.getFile = getFile;
            env.app = app;
            env.backend = backend;

            await initUsersDatabase();
            await initSessionsDatabase();
            await initUserStore();
            console.log("Users plugin mounted!");
        }
    },
    name: "Users",
    settings: [
        {
            component: shallowRef(LGeneralSettings),
            icon: faTowerControl,
            label: "General"
        },
        {
            component: shallowRef(LOAuthSettings),
            icon: faShield,
            label: "OAuth2"
        }
    ],
    windows: {
        OAuth: LOAuthWindow
    }
});
