<template>
    <Story>
        <LSettingsStoryWrapper>
            <LOAuthSettings :internals="appInternals" />
        </LSettingsStoryWrapper>
    </Story>
</template>

<script setup lang="ts">
import { LSettingsStoryWrapper } from "@luna-park/plugin";
import { reactive } from "vue";

import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
import { internals } from "@/internals";

const appInternals = reactive(internals);
</script>

<style scoped>

</style>
