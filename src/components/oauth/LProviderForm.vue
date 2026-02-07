<template>
    <div class="provider">
        <LInput
            v-model="provider.label"
            borderless
            label="Label"
            placeholder="Provider label"
        />
        <LProviderDataForm
            description="Used in the editor, for testing purposes."
            :provider-data="provider.data.development"
            title="Development"
        />
        <LProviderDataForm
            description="Used in production. If empty, fallback to development values."
            :provider-data="provider.data.production"
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
import { confirm, LButton, LInput } from "@luna-park/design";

import LProviderDataForm from "@/components/oauth/LProviderDataForm.vue";
import type { TProvider } from "@/internals";

const props = defineProps<{
    provider: TProvider;
}>();

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
