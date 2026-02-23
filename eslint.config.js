import lpConfigVue from "@luna-park/eslint-config/vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist/*"]
    },
    ...lpConfigVue,
    {
        rules: {
            "sort-keys-custom-order/object-keys": ["error", {
                orderedKeys: ["id", "name", "title", "index", "type", "start", "end", "input", "inputs", "output", "outputs",
                    "height", "width", "top", "left", "right", "bottom",
                    "in_exec", "out_exec"]
            }],
            "sort-keys-custom-order/type-keys": ["error", {
                orderedKeys: ["id", "name", "title", "index", "type", "start", "end", "input", "inputs", "output", "outputs"]
            }]
        }
    }
);
