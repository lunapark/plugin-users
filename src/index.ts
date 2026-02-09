import { faShield, faTowerControl } from "@fortawesome/pro-solid-svg-icons";
import { EElementType, makePlugin } from "@luna-park/plugin";
import { shallowRef } from "vue";

import LGeneralSettings from "@/components/general/LGeneralSettings.vue";
import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
import { internals } from "@/internals";
import { getDefaultDatabase } from "@/modules/users/database.ts";
import hashNodes from "@/nodes/hash.ts";

import icon from "./logo.svg";

export default makePlugin({
    description: "Add user accounts, connections, and roles.",
    editor: {
        nodes: [
            ...hashNodes
        ]
    },
    icon,
    id: "users",
    internals,
    lifecycle: {
        mount: async ({ addFile }) => {
            const folder = addFile({ name: "Users", type: EElementType.Folder });
            addFile(await getDefaultDatabase(), folder.id);
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
    ]
});
