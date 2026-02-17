import { faShield, faTowerControl } from "@fortawesome/pro-solid-svg-icons";
import { EElementType, makePlugin } from "@luna-park/plugin";
import { shallowRef } from "vue";

import LGeneralSettings from "@/components/general/LGeneralSettings.vue";
import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
import LOAuthWindow from "@/components/windows/LOAuthWindow.vue";
import { internals } from "@/internals";
import icon from "@/logo.svg";
import { getDefaultDatabase } from "@/modules/users/database.ts";
import { nodes } from "@/nodes";

export default makePlugin({
    description: "Add user accounts, connections, and roles.",
    editor: {
        nodes
    },
    icon,
    id: "users",
    internals,
    lifecycle: {
        mount: async ({ addFile, getFile }) => {
            if (!internals.files["database"] || !getFile(internals.files["database"])) {
                const folder = addFile({ name: "Users", type: EElementType.Folder });
                const file = addFile(await getDefaultDatabase(), folder.id);
                internals.files["database"] = file.id;
            }
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
            label: "OAuth"
        }
    ],
    windows: {
        OAuth: LOAuthWindow
    }
});
