<template>
    <div class="provider-picker">
        <div class="header">
            <div class="title">
                Add a provider
            </div>
            <div class="description">
                Pick a preset to get endpoints, scopes and identity mapping filled in for you. You'll only need a client ID and secret.
            </div>
        </div>
        <div class="presets">
            <LButton
                v-for="preset of providerPresets"
                :key="preset.id"
                class="preset"
                @click="emits('pick', preset)"
            >
                <LProviderLogo :preset-id="preset.id" />
                {{ preset.label }}
            </LButton>
            <LButton
                border
                class="custom"
                transparent
                @click="emits('pick')"
            >
                Custom OAuth2
            </LButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LButton } from "@luna-park/design";

import LProviderLogo from "@/components/oauth/LProviderLogo.vue";
import type { TProviderPreset } from "@/internals/presets.ts";
import { providerPresets } from "@/internals/presets.ts";

const emits = defineEmits<{
    (e: "pick", preset?: TProviderPreset): void;
}>();
</script>

<style scoped>
.provider-picker {
    padding: var(--length-s);
    display: flex;
    flex-direction: column;
    gap: var(--length-s);

    .header {
        display: flex;
        flex-direction: column;
        gap: var(--length-xxs);

        .title {
            font-size: var(--font-size-m);
            font-weight: 500;
        }

        .description {
            font-size: var(--font-size-s);
            color: var(--color-content-litest);
        }
    }

    .presets {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--length-xs);

        .preset {
            gap: var(--length-xs);
        }

        .custom {
            border-style: dashed;
        }
    }
}
</style>
