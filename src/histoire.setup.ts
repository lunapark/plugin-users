import "@/histoire.style.css";

import { defineSetupVue3 } from "@histoire/plugin-vue";
import { initApp } from "@luna-park/design";

import LHistoireWrapper from "@/LHistoireWrapper.vue";

export const setupVue3 = defineSetupVue3(({ addWrapper, app }) => {
    initApp(app);
    addWrapper(LHistoireWrapper);
});
