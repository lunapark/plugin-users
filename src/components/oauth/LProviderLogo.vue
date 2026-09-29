<template>
    <component
        :is="logo"
        v-if="logo"
        class="provider-logo"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { providerLogos } from "@/internals/logos.ts";

const props = defineProps<{
    presetId?: string;
}>();

const logo = computed(() => props.presetId ? providerLogos[props.presetId] : undefined);
</script>

<style scoped>
.provider-logo {
    flex: 0 0 auto;
}
</style>
