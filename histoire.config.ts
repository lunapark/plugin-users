import { HstVue } from "@histoire/plugin-vue";
import { defineConfig } from "histoire";

export default defineConfig({
    backgroundPresets: [
        {
            color: "#1e2228",
            contrastColor: "#fff",
            label: "Background"
        },
        {
            color: "transparent",
            contrastColor: "#333",
            label: "Transparent"
        }
    ],
    plugins: [
        HstVue()
    ],
    setupFile: "/src/histoire.setup.ts",
    tree: {
        file: ({ path }) => {
            const splitPath = path.split("/");
            splitPath.shift();
            splitPath.shift();
            splitPath[splitPath.length - 1] = splitPath.at(-1).split(".")[0];
            return splitPath;
        }
    },
    vite: {
        server: {
            port: 1980
        }
    }
});
