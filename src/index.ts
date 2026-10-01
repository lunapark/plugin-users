import { faShield, faTowerControl } from "@fortawesome/pro-solid-svg-icons";
import { makePlugin } from "@luna-park/plugin";
import { shallowRef } from "vue";

import { backImports, frontImports, getEnv, getInjections } from "@/build.ts";
import LGeneralSettings from "@/components/general/LGeneralSettings.vue";
import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
import LOAuthWindow from "@/components/windows/LOAuthWindow.vue";
import { configureEditorRuntime } from "@/editor/runtime.ts";
import { env } from "@/env.ts";
import { initSessionsDatabase } from "@/files/database/sessions.ts";
import { initUsersDatabase } from "@/files/database/users.ts";
import { initUserStore, setUserStore } from "@/files/store/user.ts";
import { getGuards } from "@/guards.ts";
import { hooks } from "@/hooks";
import { initGeneralSettings, internals } from "@/internals";
import icon from "@/logo.svg";
import { getNodes } from "@/nodes";
import { resolveUser } from "@/runtime/session.ts";

export default makePlugin({
    id: "users",
    name: "Users",
    description: "Add user accounts, connections, and roles.",
    build: {
        backImports,
        frontImports,
        env: getEnv,
        injections: getInjections
    },
    editor: {
        guards: getGuards,
        nodes: getNodes
    },
    hooks,
    icon,
    internals,
    lifecycle: {
        mount: async ({ addFile, app, backend, getFile }) => {
            env.addFile = addFile;
            env.getFile = getFile;
            env.app = app;
            env.backend = backend;

            initGeneralSettings();

            await initUsersDatabase();
            await initSessionsDatabase();
            await initUserStore();
            configureEditorRuntime();
            setUserStore(await resolveUser());
        }
    },
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
