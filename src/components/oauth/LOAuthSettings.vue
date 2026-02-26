<template>
    <LSettingWrapper>
        <template #menu>
            <div class="menu">
                <LButton
                    v-for="provider of internals.providers"
                    :key="provider.id"
                    borderless
                    class="provider"
                    small
                    :transparent="selectedProviderId !== provider.id"
                    @click="selectedProviderId = provider.id"
                >
                    {{ provider.label }}
                </LButton>
                <LButton
                    class="button-add"
                    :icon="faPlus"
                    small
                    transparent
                    @click="addProvider"
                >
                    Add a provider
                </LButton>
            </div>
        </template>
        <div class="content">
            <LProviderForm
                v-if="selectedProvider"
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
import { internals } from "@/internals";
import { createProvider } from "@/internals/providers.ts";

const selectedProviderId = ref(Object.keys(internals.providers)[0] ?? "");
const selectedProvider = computed(() => internals.providers[selectedProviderId.value]);

function addProvider() {
    const provider = createProvider();
    provider.data.development.url.redirect = "https://luna-park.app/plugin?plugin=@luna-park/plugin-users&window=OAuth";
    internals.providers[provider.id] = provider;
    selectedProviderId.value = provider.id;
}

function deleteProvider(providerId: string) {
    delete internals.providers[providerId];
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
