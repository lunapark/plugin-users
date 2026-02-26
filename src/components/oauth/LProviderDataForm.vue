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
            <hr>
            <LInput
                v-model="providerData.url.authorization"
                borderless
                label="Authorization URL"
                placeholder="https://example.com/oauth2/authorize"
            />
            <LInput
                v-model="providerData.url.redirect"
                borderless
                label="Redirect URL"
                placeholder="https://luna-park.app/plugin/@luna-park%2Fuser"
            />
            <LInput
                v-model="providerData.url.token"
                borderless
                label="Token URL"
                placeholder="https://example.com/oauth2/token"
            />
            <hr>
            <LInput
                v-model="providerData.api.url"
                borderless
                label="API target"
                placeholder="https://example.com/api/me"
            />
            <LInput
                v-model="providerData.api.value"
                borderless
                label="API value path"
                placeholder="mail"
            />
            <LInput
                v-model="providerData.api.id"
                borderless
                label="API id path"
                placeholder="id"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { LInput } from "@luna-park/design";

import type { TProviderData } from "@/internals/providers.ts";

const props = defineProps<{
    title: string;
    description: string;
    providerData: TProviderData;
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

        hr {
            border: none;
            border-top: 1px solid var(--color-soft-lite);
            width: 80%;
        }
    }
}
</style>
