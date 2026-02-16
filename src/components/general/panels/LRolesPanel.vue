<template>
    <LPanelWrapper class="roles-panel">
        <h2>Roles</h2>
        <div class="roles">
            <LRoleCard
                v-for="role of internals.roles"
                :key="role.id"
                :permissions="internals.permissions"
                :role="role"
                @delete="deleteRole(role.id)"
            />
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
                    label="Identifier"
                    :placeholder="defaultId"
                />
                <LButton
                    borderless
                    :disabled="!newRole.label"
                    :icon="faPlus"
                    primary
                    square
                    @click="addNewRole"
                />
            </div>
        </div>
    </LPanelWrapper>
</template>

<script setup lang="ts">
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { computed, reactive } from "vue";

import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
import LRoleCard from "@/components/general/panels/LRoleCard.vue";
import { addRole, internals } from "@/internals";

const newRole = reactive({
    id: "",
    label: ""
});

const defaultId = computed(() => kebabCase(newRole.label));

function deleteRole(roleId: string) {
    if (!confirm(`Are you sure you want to delete the role "${ internals.roles[roleId].label }"?`)) {
        return;
    }

    delete internals.roles[roleId];
}

function addNewRole() {
    addRole({
        id: newRole.id || defaultId.value,
        label: newRole.label,
        permissions: []
    });

    newRole.label = "";
    newRole.id = "";
}
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
