<template>
    <LPanelWrapper class="roles-panel">
        <h2>Roles</h2>
        <div class="roles">
            <div
                v-for="role of internals.roles"
                :key="role.id"
                class="role"
            >
                <LInput
                    v-model="role.label"
                    borderless
                    class="input"
                    label="Label"
                />
                <LInput
                    v-model="role.id"
                    borderless
                    class="input"
                    disabled
                    label="Identifier"
                />
                <div class="delete">
                    <LButton
                        borderless
                        error
                        :icon="faTrash"
                        square
                    />
                </div>
            </div>
            <div class="role">
                <LInput
                    v-model="newRole.label"
                    borderless
                    class="input"
                    label="Label"
                />
                <LInput
                    v-model="newRole.id"
                    borderless
                    class="input"
                    disabled
                    label="Identifier"
                    :placeholder="defaultId"
                />
                <LButton
                    borderless
                    :icon="faPlus"
                    primary
                    square
                />
            </div>
        </div>
    </LPanelWrapper>
</template>

<script setup lang="ts">
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { computed, reactive } from "vue";

import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
import type { TInternals } from "@/internals";

const props = defineProps<{
    internals: TInternals;
}>();

const newRole = reactive({
    id: "",
    label: ""
});

const defaultId = computed(() => kebabCase(newRole.label));
</script>

<style scoped>
.roles-panel {
    .roles {
        display: flex;
        flex-direction: column;
        gap: var(--length-xs);

        .role {
            display: flex;
            gap: var(--length-s);
            border: 1px solid var(--color-soft-lite);
            padding: var(--length-xs);
            border-radius: var(--length-radius-s);
            background-color: var(--color-background-dark);

            .input {
                flex: 1 1 0;
            }
        }
    }
}
</style>
