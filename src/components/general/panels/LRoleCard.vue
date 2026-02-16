<template>
    <div class="role">
        <div class="head">
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
                    @click="emits('delete')"
                />
            </div>
        </div>
        <div class="permissions">
            <LButton
                v-for="(permission, id) of permissions"
                :key="id"
                class="permission"
                :primary="role.permissions.includes(id)"
                small
                @click="togglePermission(id)"
            >
                {{ permission.label }}
            </LButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import { LButton, LInput } from "@luna-park/design";

import type { TPermission, TRole } from "@/internals/roles.ts";

const props = defineProps<{
    permissions: Record<string, TPermission>;
    role: TRole;
}>();

const emits = defineEmits<{
    (e: "delete"): void;
}>();

function togglePermission(permissionId: string) {
    if (props.role.permissions.includes(permissionId)) {
        props.role.permissions = props.role.permissions.filter((id) => id !== permissionId);
    }
    else {
        props.role.permissions.push(permissionId);
    }
}
</script>

<style scoped>
.role {
    border: 1px solid var(--color-soft-lite);
    padding: var(--length-xs);
    border-radius: var(--length-radius-s);
    background-color: var(--color-background-dark);
    display: flex;
    flex-direction: column;

    .head {
        width: 100%;
        display: flex;
        gap: var(--length-s);

        .input {
            flex: 1 1 0;
        }
    }

    .permissions {
        display: flex;
        gap: var(--length-xs);

        .permission {

        }
    }
}
</style>
