<template>
    <div class="roles">
        <h3>Roles</h3>
        <div
            v-for="(role, id) of internals.roles"
            :key="id"
            class="role"
        >
            <LInput
                borderless
                disabled
                :model-value="role.label"
                small
            />
            <LButton
                borderless
                :disabled="role.freeze"
                :icon="faTrash"
                small
                square
                @click="deleteRole(id)"
            />
        </div>
        <div class="role">
            <LInput
                v-model="newRole"
                borderless
                placeholder="New Role..."
                small
            />
            <LButton
                borderless
                :disabled="!newRole"
                :icon="faPlus"
                primary
                small
                square
                @click="addNewRole"
            />
        </div>
    </div>
</template>

<script setup lang="ts">

import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { ref } from "vue";

import { addRole, internals } from "@/internals";

const newRole = ref("");

function addNewRole() {
    addRole({
        id: kebabCase(newRole.value),
        label: newRole.value,
        permissions: []
    });

    newRole.value = "";
}

function deleteRole(roleId: string) {
    if (!confirm(`Are you sure you want to delete the role "${ internals.roles[roleId]?.label }"?`)) {
        return;
    }

    delete internals.roles[roleId];
}
</script>

<style scoped>
.roles {
    background-color: var(--color-background-dark);
    display: flex;
    flex-direction: column;
    gap: var(--length-xs);
    padding: var(--length-m);
    border-radius: var(--length-radius-s);
    border: 1px solid var(--color-soft-lite);
    flex: 1 1 0;

    h3 {
        font-size: var(--font-size-s);
        color: var(--color-content-lite);
    }

    .role {
        display: flex;
        gap: var(--length-xs);

        &:deep(.input) {
            flex: 1 1 0;
        }
    }
}
</style>
