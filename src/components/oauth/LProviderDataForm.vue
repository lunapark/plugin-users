<template>
    <div class="provider-data">
        <div class="header">
            <div class="title">
                {{ title }}
            </div>
            <div class="description">
                {{ description }}
            </div>
        </div>
        <div class="content">
            <LInput
                v-model="providerData.client.id"
                borderless
                label="Client ID"
                placeholder="abc123"
            />
            <LInput
                v-model="providerData.client.secret"
                borderless
                label="Client secret"
                placeholder="abc123"
            />
            <LInput
                v-model="providerData.target.url"
                borderless
                label="Target URL"
                placeholder="https://example.com/oauth/authorize"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { LInput } from "@luna-park/design";

import type { TProviderData } from "@/internals";

const props = defineProps<{
    description: string;
    providerData: TProviderData;
    title: string;
}>();
</script>

<style scoped>
.provider-data {
    border: 1px solid var(--color-soft-lite);
    border-radius: var(--length-radius-s);
    padding: var(--length-xs);
    display: flex;
    flex-direction: column;
    gap: var(--length-s);

    .header {
        display: flex;
        flex-direction: column;
        gap: var(--length-xxs);

        .title {
            font-size: var(--font-size-s);
            font-weight: 500;
        }

        .description {
            font-size: var(--font-size-s);
            color: var(--color-content-litest);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: var(--length-s);
    }
}
</style>
