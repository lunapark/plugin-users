<template>
    <LPanelWrapper class="permissions-panel">
        <h2>Permissions</h2>
        <div class="permissions">
            <div
                v-for="permission of internals.permissions"
                :key="permission.id"
                class="permission"
            >
                <LInput
                    v-model="permission.label"
                    borderless
                    class="input"
                    label="Label"
                />
                <LInput
                    v-model="permission.id"
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
                        @click="deletePermission(permission.id)"
                    />
                </div>
            </div>
            <div class="permission">
                <LInput
                    v-model="newPermission.label"
                    borderless
                    class="input"
                    label="Label"
                />
                <LInput
                    v-model="newPermission.id"
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
                    @click="addNewPermission"
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
import { addPermission, internals } from "@/internals";

const newPermission = reactive({
    id: "",
    label: ""
});

const defaultId = computed(() => kebabCase(newPermission.label));

function addNewPermission() {
    addPermission({
        id: newPermission.id || defaultId.value,
        label: newPermission.label
    });

    newPermission.label = "";
    newPermission.id = "";
}

function deletePermission(permissionId: string) {
    if (!confirm(`Are you sure you want to delete the permission "${ internals.permissions[permissionId]?.label }"?`)) {
        return;
    }

    delete internals.permissions[permissionId];
}

</script>

<style scoped>
.permissions-panel {
    .permissions {
        display: flex;
        flex-direction: column;
        gap: var(--length-xs);

        .permission {
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
