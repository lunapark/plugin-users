<template>
    <div class="permissions">
        <h3>Permissions</h3>
        <div
            v-for="(permission, id) of internals.permissions"
            :key="id"
            class="permission"
        >
            <LInput
                v-model="permission.label"
                small
            />
            <LButton
                :icon="faTrash"
                small
                square
                @click="deletePermission(id)"
            />
        </div>
        <div class="permission">
            <LInput
                v-model="newPermission"
                placeholder="New Permission..."
                small
            />
            <LButton
                :disabled="!newPermission.trim()"
                :icon="faPlus"
                primary
                small
                square
                @click="addNewPermission"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { alert, confirm, LButton, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { ref } from "vue";

import { addPermission, internals } from "@/internals";

const newPermission = ref("");

async function addNewPermission() {
    const label = newPermission.value.trim();

    if (!addPermission({ id: kebabCase(label) || crypto.randomUUID(), label })) {
        await alert(`Permission "${ label }" already exists.`);
        return;
    }

    newPermission.value = "";
}

async function deletePermission(permissionId: string) {
    if (!await confirm(`Are you sure you want to delete the permission "${ internals.permissions[permissionId]?.label }"?`)) {
        return;
    }

    delete internals.permissions[permissionId];
}
</script>

<style scoped>
.permissions {
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

    .permission {
        display: flex;
        gap: var(--length-xs);

        &:deep(.input) {
            flex: 1 1 0;
        }
    }
}
</style>
