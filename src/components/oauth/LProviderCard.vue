<template>
    <LCard class="provider-card">
        <button
            class="summary"
            type="button"
            @click="opened = !opened"
        >
            <LProviderLogo :preset-id="provider.preset" />
            <span class="label">{{ provider.label }}</span>
            <span
                class="status"
                :class="{ ready: !missingProductionFields.length }"
            >
                {{ missingProductionFields.length ? "Production incomplete" : "Ready" }}
            </span>
            <LIcon
                class="chevron"
                :icon="opened ? faChevronUp : faChevronDown"
            />
        </button>

        <div
            v-if="opened"
            class="details"
        >
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
            <div class="environment">
                <LSegmented
                    v-model="environment"
                    :options="environmentOptions"
                    small
                />
                <LButton
                    v-if="environment === 'development'"
                    :icon="faPlug"
                    :loading="testing"
                    small
                    @click="testConnection"
                >
                    Test connection
                </LButton>
            </div>
            <LContainer
                v-if="environment === 'production' && missingProductionFields.length"
                small
                title="Production is not ready"
                :type="EContainerType.Warning"
            >
                OAuth sign-in will fail once deployed. Missing: {{ missingProductionFields.join(", ") }}.
            </LContainer>
            <LProviderDataForm
                v-if="environment === 'development'"
                key="development"
                :collapsible="!!preset"
                description="Used in the editor, for testing purposes."
                :provider-data="provider.data.development"
                :redirect-placeholder="developmentRedirectUrl"
            />
            <LProviderDataForm
                v-else
                key="production"
                :collapsible="!!preset"
                description="Used in production. Empty fields fall back to development values, except the redirect URL."
                :provider-data="provider.data.production"
                :redirect-placeholder="productionRedirectUrl"
            />
        </div>

        <LSettingRow
            v-if="opened"
            class="danger"
            description="Users can no longer sign in with this provider."
            title="Delete provider"
        >
            <LButton
                error
                :icon="faTrash"
                small
                @click="deleteProvider"
            >
                Delete
            </LButton>
        </LSettingRow>
    </LCard>
</template>

<script setup lang="ts">
import { faChevronDown, faChevronUp, faPlug, faTrash, faTriangleExclamation } from "@fortawesome/pro-solid-svg-icons";
import type { TOptions } from "@luna-park/design";
import { confirm, EContainerType, LButton, LCard, LContainer, LIcon, LInput, LSegmented, LSettingRow, useToastStore } from "@luna-park/design";
import { computed, ref } from "vue";

import LProviderDataForm from "@/components/oauth/LProviderDataForm.vue";
import LProviderGuide from "@/components/oauth/LProviderGuide.vue";
import LProviderLogo from "@/components/oauth/LProviderLogo.vue";
import { testOAuthConnection } from "@/editor/oauth.ts";
import { getProviderPreset } from "@/internals/presets.ts";
import type { TProvider } from "@/internals/providers.ts";
import { developmentRedirectUrl, getMissingProductionFields, productionRedirectUrl } from "@/internals/providers.ts";

const props = defineProps<{
    provider: TProvider;
}>();

const emits = defineEmits<{
    (e: "delete"): void;
}>();

const opened = defineModel<boolean>("opened", { default: false });
const environment = ref<"development" | "production">("development");
const testing = ref(false);
const toasts = useToastStore();

const preset = computed(() => getProviderPreset(props.provider.preset));
const missingProductionFields = computed(() => getMissingProductionFields(props.provider));

const environmentOptions = computed(() => [
    { label: "Development", value: "development" },
    {
        label: "Production",
        value: "production",
        ...missingProductionFields.value.length ? { icon: { color: "var(--color-warning)", icon: faTriangleExclamation } } : {}
    }
] satisfies TOptions);

async function testConnection() {
    testing.value = true;

    try {
        const identity = await testOAuthConnection(props.provider.id);

        if (identity) {
            toasts.add({
                message: `Signed in as ${ identity.value } (id ${ identity.id }).`,
                title: "Connection successful",
                type: EContainerType.Success
            });
        }
    }
    catch (error) {
        toasts.add({
            message: error instanceof Error ? error.message : String(error),
            title: "Connection failed",
            type: EContainerType.Error
        });
    }
    finally {
        testing.value = false;
    }
}

async function deleteProvider() {
    if (await confirm("Are you sure you want to delete this provider?")) {
        emits("delete");
    }
}
</script>

<style scoped>
.provider-card {
    .summary {
        display: flex;
        align-items: center;
        gap: var(--length-xs);
        padding: var(--length-xs) var(--length-s);
        border: none;
        background: none;
        color: var(--color-content);
        font: inherit;
        text-align: left;
        cursor: pointer;

        .label {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            font-size: var(--font-size-s);
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .status {
            flex: 0 0 auto;
            font-size: var(--font-size-xs);
            color: var(--color-warning);

            &.ready {
                color: var(--color-success);
            }
        }

        .chevron {
            flex: 0 0 auto;
            font-size: var(--font-size-xs);
            color: var(--color-content-liter);
        }
    }

    .details {
        display: flex;
        flex-direction: column;
        gap: var(--length-s);
        padding: var(--length-s);
        border-top: 1px solid var(--color-background-2);

        .environment {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--length-xs);
        }
    }

    .danger {
        border-top: 1px solid var(--color-background-2);
        background: var(--color-error-background);
    }
}
</style>
