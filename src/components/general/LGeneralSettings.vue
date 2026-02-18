<template>
    <LSettingWrapper>
        <template #menu>
            <div class="menu">
                <LButton
                    v-for="button of buttons"
                    :key="button.panel"
                    borderless
                    class="button"
                    :icon="button.icon"
                    small
                    :transparent="currentPanel !== button.panel"
                    @click="currentPanel = button.panel"
                >
                    {{ button.label }}
                </LButton>
            </div>
        </template>
        <div class="content">
            <LGeneralPanel v-if="currentPanel === EPanel.General" />
            <LAccessPanel v-if="currentPanel === EPanel.Access" />
        </div>
    </LSettingWrapper>
</template>

<script setup lang="ts">
import { faIdCard, faTowerControl } from "@fortawesome/pro-solid-svg-icons";
import { LButton } from "@luna-park/design";
import { ref } from "vue";

import LAccessPanel from "@/components/general/panels/access/LAccessPanel.vue";
import LGeneralPanel from "@/components/general/panels/LGeneralPanel.vue";
import LSettingWrapper from "@/components/LSettingWrapper.vue";

enum EPanel {
    General = "general",
    Access = "access"
}

const buttons = [
    {
        icon: faTowerControl,
        label: "General",
        panel: EPanel.General
    },
    {
        icon: faIdCard,
        label: "Access",
        panel: EPanel.Access
    }
];

const currentPanel = ref(EPanel.General);
</script>

<style scoped>
.menu {
    display: flex;
    padding: var(--length-xxs);
    flex-direction: column;
    gap: var(--length-xxs);

    .button {
        font-size: var(--font-size-s);
        border-radius: var(--length-radius-xs);
        height: 24px;
        display: flex;
        justify-content: flex-start;
    }
}
</style>
