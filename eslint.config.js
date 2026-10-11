import lpConfigVue from "@luna-park/eslint-config/vue";
import tseslint from "typescript-eslint";
import lpConfigPlugin from "@luna-park/plugin/eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    ...lpConfigVue,
    lpConfigPlugin
);
