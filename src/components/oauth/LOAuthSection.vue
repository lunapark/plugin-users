<template>
    <div class="oauth-section">
        <LProviderCard
            v-for="(provider, id) of internals.providers"
            :key="id"
            :opened="openedId === id"
            :provider="provider"
            @delete="deleteProvider(id)"
            @update:opened="openedId = $event ? id : ''"
        />

        <LCard v-if="showPicker">
            <LProviderPicker
                :closable="hasProviders"
                @close="picking = false"
                @pick="addProvider"
            />
        </LCard>
        <LButton
            v-else
            class="add"
            :icon="faPlus"
            small
            @click="picking = true"
        >
            Add a provider
        </LButton>
    </div>
</template>

<script setup lang="ts">
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LCard } from "@luna-park/design";
import { computed, ref } from "vue";

import LProviderCard from "@/components/oauth/LProviderCard.vue";
import LProviderPicker from "@/components/oauth/LProviderPicker.vue";
import { internals } from "@/internals";
import type { TProviderPreset } from "@/internals/presets.ts";
import { createProvider } from "@/internals/providers.ts";

const openedId = ref("");
const picking = ref(false);

const hasProviders = computed(() => Object.keys(internals.providers).length > 0);
const showPicker = computed(() => picking.value || !hasProviders.value);

function addProvider(preset?: TProviderPreset) {
    const provider = createProvider(preset, internals.general.identifier);
    internals.providers[provider.id] = provider;
    openedId.value = provider.id;
    picking.value = false;
}

function deleteProvider(providerId: string) {
    delete internals.providers[providerId];
}
</script>

<style scoped>
.oauth-section {
    display: flex;
    flex-direction: column;
    gap: var(--length-xs);

    .add {
        align-self: flex-start;
    }
}
</style>
