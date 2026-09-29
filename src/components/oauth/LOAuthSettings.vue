<template>
    <LSettingWrapper>
        <template #menu>
            <div class="menu">
                <LButton
                    v-for="provider of internals.providers"
                    :key="provider.id"
                    class="provider"
                    small
                    :transparent="picking || selectedProviderId !== provider.id"
                    @click="selectProvider(provider.id)"
                >
                    <LProviderLogo :preset-id="provider.preset" />
                    {{ provider.label }}
                </LButton>
                <LButton
                    border
                    class="button-add"
                    :icon="faPlus"
                    small
                    :transparent="!picking"
                    @click="picking = true"
                >
                    Add a provider
                </LButton>
            </div>
        </template>
        <div class="content">
            <LProviderPicker
                v-if="picking"
                @pick="addProvider"
            />
            <LProviderForm
                v-else-if="selectedProvider"
                :key="selectedProvider.id"
                :provider="selectedProvider"
                @delete="deleteProvider(selectedProvider.id)"
            />
            <div
                v-else
                class="empty"
            >
                Select a provider to configure it.
            </div>
        </div>
    </LSettingWrapper>
</template>

<script setup lang="ts">
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { LButton } from "@luna-park/design";
import { computed, ref } from "vue";

import LSettingWrapper from "@/components/LSettingWrapper.vue";
import LProviderForm from "@/components/oauth/LProviderForm.vue";
import LProviderLogo from "@/components/oauth/LProviderLogo.vue";
import LProviderPicker from "@/components/oauth/LProviderPicker.vue";
import { internals } from "@/internals";
import type { TProviderPreset } from "@/internals/presets.ts";
import { createProvider } from "@/internals/providers.ts";

const selectedProviderId = ref(Object.keys(internals.providers)[0] ?? "");
const selectedProvider = computed(() => internals.providers[selectedProviderId.value]);
const picking = ref(!selectedProvider.value);

function selectProvider(providerId: string) {
    selectedProviderId.value = providerId;
    picking.value = false;
}

function addProvider(preset?: TProviderPreset) {
    const provider = createProvider(preset, internals.general.identifier);
    internals.providers[provider.id] = provider;
    selectProvider(provider.id);
}

function deleteProvider(providerId: string) {
    delete internals.providers[providerId];
    picking.value = !Object.keys(internals.providers).length;
}
</script>

<style scoped>
.menu {
    display: flex;
    padding: var(--length-xxs);
    flex-direction: column;
    gap: var(--length-xxs);

    .provider {
        font-size: var(--font-size-s);
        border-radius: var(--length-radius-xs);
        height: 24px;
        display: flex;
        justify-content: flex-start;
        gap: var(--length-xs);
    }

    .button-add {
        height: 24px;
        border-style: dashed;
    }
}

.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-m);
    min-height: 200px;
    color: var(--color-content-liter);
}
</style>
