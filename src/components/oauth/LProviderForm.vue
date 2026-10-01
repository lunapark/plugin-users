<template>
    <div class="provider">
        <LInput
            v-model="provider.label"
            label="Label"
            placeholder="Provider label"
        />
        <LProviderGuide
            v-if="preset"
            :preset="preset"
            :provider="provider"
        />
        <LProviderDataForm
            :collapsible="!!preset"
            description="Used in the editor, for testing purposes."
            :provider-data="provider.data.development"
            :redirect-placeholder="developmentRedirectUrl"
            title="Development"
        />
        <LContainer
            v-if="missingProductionFields.length"
            small
            title="Production is not ready"
            :type="EContainerType.Warning"
        >
            OAuth sign-in will fail once deployed. Missing: {{ missingProductionFields.join(", ") }}.
        </LContainer>
        <LProviderDataForm
            :collapsible="!!preset"
            description="Used in production. Empty fields fall back to development values, except the redirect URL."
            :provider-data="provider.data.production"
            :redirect-placeholder="productionRedirectUrl"
            title="Production"
        />
        <LButton
            error
            @click="deleteProvider"
        >
            Delete this provider
        </LButton>
    </div>
</template>

<script setup lang="ts">
import { confirm, EContainerType, LButton, LContainer, LInput } from "@luna-park/design";
import { computed } from "vue";

import LProviderDataForm from "@/components/oauth/LProviderDataForm.vue";
import LProviderGuide from "@/components/oauth/LProviderGuide.vue";
import { getProviderPreset } from "@/internals/presets.ts";
import type { TProvider } from "@/internals/providers.ts";
import { developmentRedirectUrl, getMissingProductionFields, productionRedirectUrl } from "@/internals/providers.ts";

const props = defineProps<{
    provider: TProvider;
}>();

const preset = computed(() => getProviderPreset(props.provider.preset));
const missingProductionFields = computed(() => getMissingProductionFields(props.provider));

const emits = defineEmits<{
    (e: "delete"): void;
}>();

async function deleteProvider() {
    if (await confirm("Are you sure you want to delete this provider?")) {
        emits("delete");
    }
}
</script>

<style scoped>
.provider {
    padding: var(--length-s);
    display: flex;
    flex-direction: column;
    gap: var(--length-s);
}
</style>
