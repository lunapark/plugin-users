import { faArrowRightToBracket, faKey, faShield, faUserShield } from "@fortawesome/pro-solid-svg-icons";
import { makePlugin } from "@luna-park/plugin";

import { getApi } from "@/api.ts";
import { backImports, frontImports, getEnv, getInjections } from "@/build.ts";
import LAccessSection from "@/components/access/LAccessSection.vue";
import LPasswordSection from "@/components/general/LPasswordSection.vue";
import LSignInSection from "@/components/general/LSignInSection.vue";
import LOAuthSection from "@/components/oauth/LOAuthSection.vue";
import LOAuthWindow from "@/components/windows/LOAuthWindow.vue";
import { config } from "@/config.ts";
import { configureEditorRuntime } from "@/editor/runtime.ts";
import { env } from "@/env.ts";
import { initSessionsDatabase } from "@/files/database/sessions.ts";
import { initUsersDatabase } from "@/files/database/users.ts";
import { initUserStore, setUserStore } from "@/files/store/user.ts";
import { getGuards } from "@/guards.ts";
import { hooks } from "@/hooks";
import { initGeneralSettings, internals } from "@/internals";
import { syncProviderSecrets } from "@/internals/secrets.ts";
import icon from "@/logo.svg";
import { migrateSecrets } from "@/migrations/secrets.ts";
import { getNodes } from "@/nodes";
import { resolveUser } from "@/runtime/session.ts";

export default makePlugin({
    id: "users",
    name: "Users",
    description: "Add user accounts, connections, and roles.",
    icon,
    config,
    internals,
    lifecycle: {
        mount: async (pluginEnv) => {
            env.addFile = pluginEnv.addFile;
            env.getFile = pluginEnv.getFile;
            env.app = pluginEnv.app;
            env.backend = pluginEnv.backend;
            env.config = pluginEnv.config;
            env.host = pluginEnv.host;
            env.secrets = pluginEnv.secrets;

            initGeneralSettings();
            syncProviderSecrets();
            await migrateSecrets(pluginEnv);

            await initUsersDatabase();
            await initSessionsDatabase();
            await initUserStore();
            configureEditorRuntime();
            setUserStore(await resolveUser());
        }
    },
    editor: {
        nodes: getNodes,
        guards: getGuards
    },
    hooks,
    windows: {
        OAuth: LOAuthWindow
    },
    build: {
        backImports,
        env: getEnv,
        frontImports,
        injections: getInjections
    },
    api: getApi,
    workspace: {
        openOnClick: true,
        sections: [
            {
                id: "sign-in",
                component: LSignInSection,
                description: "How users identify themselves when they sign up and sign in.",
                icon: faArrowRightToBracket,
                title: "Sign-in"
            },
            {
                id: "password",
                component: LPasswordSection,
                description: "Rules a password must follow on sign-up and password change.",
                icon: faKey,
                title: "Password"
            },
            {
                id: "access",
                component: LAccessSection,
                description: "Roles assigned to users, and the permissions each role grants. Check a cell to grant a permission.",
                icon: faUserShield,
                title: "Roles & permissions"
            },
            {
                id: "oauth",
                component: LOAuthSection,
                description: "Let users sign in with an external account. Presets fill in endpoints, scopes and identity mapping.",
                icon: faShield,
                title: "OAuth providers"
            }
        ]
    }
});
