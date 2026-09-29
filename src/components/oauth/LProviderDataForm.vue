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
                label="Client ID"
                placeholder="abc123"
            />
            <LInput
                v-model="providerData.client.secret"
                label="Client secret"
                placeholder="abc123"
            />
            <LInput
                v-model="providerData.url.redirect"
                label="Redirect URL"
                :placeholder="redirectPlaceholder"
            />
            <LButton
                v-if="collapsible"
                class="toggle"
                :icon="showEndpoints ? faChevronUp : faChevronDown"
                small
                transparent
                @click="showEndpoints = !showEndpoints"
            >
                {{ showEndpoints ? "Hide" : "Show" }} endpoints
            </LButton>
            <template v-if="showEndpoints">
                <hr>
                <LInput
                    v-model="providerData.url.authorization"
                    label="Authorization URL"
                    placeholder="https://example.com/oauth2/authorize"
                />
                <LInput
                    v-model="providerData.url.token"
                    label="Token URL"
                    placeholder="https://example.com/oauth2/token"
                />
                <LInput
                    v-model="providerData.scope"
                    label="Scope"
                    placeholder="openid email profile"
                />
                <hr>
                <LInput
                    v-model="providerData.api.url"
                    label="API target"
                    placeholder="https://example.com/api/me"
                />
                <LInput
                    v-model="providerData.api.value"
                    label="API value path"
                    placeholder="mail"
                />
                <LInput
                    v-model="providerData.api.id"
                    label="API id path"
                    placeholder="id"
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { faChevronDown, faChevronUp } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";
import { ref } from "vue";

import type { TProviderData } from "@/internals/providers.ts";

const props = defineProps<{
    title: string;
    collapsible?: boolean;
    description: string;
    providerData: TProviderData;
    redirectPlaceholder: string;
}>();

const showEndpoints = ref(!props.collapsible);
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

        .toggle {
            align-self: flex-start;
        }

        hr {
            border: none;
            border-top: 1px solid var(--color-soft-lite);
            width: 80%;
        }
    }
}
</style>
