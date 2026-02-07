<template>
    <Story>
        <LSettingsStoryWrapper>
            <LGeneralSettings :internals="appInternals" />
        </LSettingsStoryWrapper>
    </Story>
</template>

<script setup lang="ts">
import { LSettingsStoryWrapper } from "@luna-park/plugin";
import { reactive } from "vue";

import LGeneralSettings from "@/components/general/LGeneralSettings.vue";
import { internals } from "@/internals";

const appInternals = reactive(internals);
</script>

<style scoped>

</style>
