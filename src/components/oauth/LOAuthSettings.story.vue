<template>
    <Story>
        <LSettingsStoryWrapper>
            <LOAuthSettings />
        </LSettingsStoryWrapper>
    </Story>
</template>

<script setup lang="ts">
import { LSettingsStoryWrapper } from "@luna-park/plugin";

import LOAuthSettings from "@/components/oauth/LOAuthSettings.vue";
</script>

<style scoped>

</style>
