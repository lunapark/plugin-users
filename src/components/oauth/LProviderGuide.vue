<template>
    <div class="provider-guide">
        <div class="header">
            <div class="title">
                <LProviderLogo :preset-id="preset.id" />
                {{ preset.label }} setup
            </div>
            <LButton
                :href="preset.console.url"
                :icon="faArrowUpRightFromSquare"
                small
                target="_blank"
            >
                Open {{ preset.console.label }}
            </LButton>
        </div>
        <ol class="steps">
            <li
                v-for="step of preset.steps"
                :key="step"
            >
                {{ step }}
            </li>
        </ol>
        <div class="redirects">
            <div
                v-for="redirect of redirects"
                :key="redirect.label"
                class="redirect"
            >
                <span class="label">{{ redirect.label }}</span>
                <code>{{ redirect.url }}</code>
                <LButton
                    :icon="copied === redirect.url ? faCheck : faCopy"
                    lite
                    small
                    square
                    @click="copy(redirect.url)"
                />
            </div>
        </div>
        <LInfo
            v-for="note of preset.notes"
            :key="note"
        >
            {{ note }}
        </LInfo>
    </div>
</template>

<script setup lang="ts">
import { faArrowUpRightFromSquare, faCheck, faCopy } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInfo } from "@luna-park/design";
import { computed, ref } from "vue";

import LProviderLogo from "@/components/oauth/LProviderLogo.vue";
import type { TProviderPreset } from "@/internals/presets.ts";
import type { TProvider } from "@/internals/providers.ts";
import { developmentRedirectUrl, productionRedirectUrl } from "@/internals/providers.ts";

const props = defineProps<{
    preset: TProviderPreset;
    provider: TProvider;
}>();

const redirects = computed(() => [
    { label: "Development", url: props.provider.data.development.url.redirect || developmentRedirectUrl },
    { label: "Production", url: props.provider.data.production.url.redirect || productionRedirectUrl }
]);

const copied = ref("");

async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    copied.value = url;
    setTimeout(() => copied.value = "", 1500);
}
</script>

<style scoped>
.provider-guide {
    border: 1px solid var(--color-soft-lite);
    border-radius: var(--length-radius-s);
    padding: var(--length-xs);
    display: flex;
    flex-direction: column;
    gap: var(--length-s);
    font-size: var(--font-size-s);

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--length-xs);

        .title {
            display: flex;
            align-items: center;
            gap: var(--length-xs);
            font-weight: 500;
        }
    }

    .steps {
        margin: 0;
        padding-left: var(--length-m);
        display: flex;
        flex-direction: column;
        gap: var(--length-xxs);
        color: var(--color-content-lite);
    }

    .redirects {
        display: flex;
        flex-direction: column;
        gap: var(--length-xxs);

        .redirect {
            display: flex;
            align-items: center;
            gap: var(--length-xs);

            .label {
                flex: 0 0 88px;
                color: var(--color-content-litest);
            }

            code {
                flex: 1 1 auto;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
