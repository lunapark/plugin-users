<template>
    <div class="provider-data">
        <p class="description">
            {{ description }}
        </p>
        <div class="fields">
            <LInput
                v-model="providerData.client.id"
                label="Client ID"
                placeholder="abc123"
            />
            <LInput
                v-model="providerData.client.secret"
                label="Client secret"
                placeholder="abc123"
                type="password"
            />
            <LInput
                v-model="providerData.url.redirect"
                class="wide"
                label="Redirect URL"
                :placeholder="redirectPlaceholder"
            />
        </div>
        <LButton
            v-if="collapsible"
            class="toggle"
            :icon="showAdvanced ? faChevronUp : faChevronDown"
            small
            transparent
            @click="showAdvanced = !showAdvanced"
        >
            {{ showAdvanced ? "Hide" : "Show" }} advanced
        </LButton>
        <div
            v-if="showAdvanced"
            class="fields"
        >
            <LInput
                v-model="providerData.url.authorization"
                class="wide"
                label="Authorization URL"
                placeholder="https://example.com/oauth2/authorize"
            />
            <LInput
                v-model="providerData.url.token"
                class="wide"
                label="Token URL"
                placeholder="https://example.com/oauth2/token"
            />
            <LInput
                v-model="providerData.scope"
                class="wide"
                label="Scope"
                placeholder="openid email profile"
            />
            <LInput
                v-model="providerData.api.url"
                class="wide"
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { faChevronDown, faChevronUp } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";
import { ref } from "vue";

import type { TProviderData } from "@/internals/providers.ts";

const props = defineProps<{
    collapsible?: boolean;
    description: string;
    providerData: TProviderData;
    redirectPlaceholder: string;
}>();

const showAdvanced = ref(!props.collapsible);
</script>

<style scoped>
.provider-data {
    display: flex;
    flex-direction: column;
    gap: var(--length-s);

    .description {
        margin: 0;
        font-size: var(--font-size-xs);
        color: var(--color-content-liter);
    }

    .fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--length-s);

        .wide {
            grid-column: 1 / -1;
        }
    }

    .toggle {
        align-self: flex-start;
    }
}
</style>
