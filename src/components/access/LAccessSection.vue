<template>
    <LCard class="access">
        <table>
            <thead>
                <tr>
                    <th class="corner" />
                    <th
                        v-for="(role, id) of internals.roles"
                        :key="id"
                        class="role"
                    >
                        <LFloating
                            class="anchor"
                            placement="top-start"
                        >
                            <button
                                class="label"
                                :title="role.label"
                                type="button"
                            >
                                <span class="text">{{ role.label }}</span>
                                <LIcon
                                    v-if="role.freeze"
                                    class="lock"
                                    :icon="faLock"
                                />
                            </button>
                            <template #popper="{ hide }">
                                <div class="role-editor">
                                    <LInput
                                        v-model="role.label"
                                        label="Role name"
                                        small
                                        @enter="hide()"
                                    />
                                    <span
                                        v-if="role.freeze"
                                        class="hint"
                                    >
                                        Built-in role, it can't be deleted.
                                    </span>
                                    <LButton
                                        v-else
                                        error
                                        :icon="faTrash"
                                        small
                                        @click="hide(); deleteRole(id)"
                                    >
                                        Delete role
                                    </LButton>
                                </div>
                            </template>
                        </LFloating>
                    </th>
                    <th class="role add">
                        <LFloating
                            class="anchor"
                            placement="top-start"
                        >
                            <button
                                class="label add"
                                type="button"
                            >
                                <span class="text">+ Role</span>
                            </button>
                            <template #popper="{ hide }">
                                <div class="role-editor">
                                    <LInput
                                        v-model="newRole"
                                        focus
                                        label="New role"
                                        placeholder="Editor"
                                        small
                                        @enter="addNewRole(hide)"
                                    />
                                    <LButton
                                        :disabled="!newRole.trim()"
                                        :icon="faPlus"
                                        primary
                                        small
                                        @click="addNewRole(hide)"
                                    >
                                        Add role
                                    </LButton>
                                </div>
                            </template>
                        </LFloating>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(permission, id) of internals.permissions"
                    :key="id"
                >
                    <th class="permission">
                        <div class="cell">
                            <LInput
                                v-model="permission.label"
                                small
                                transparent
                            />
                            <LButton
                                class="delete"
                                :icon="faTrash"
                                small
                                square
                                transparent
                                @click="deletePermission(id)"
                            />
                        </div>
                    </th>
                    <td
                        v-for="role of internals.roles"
                        :key="role.id"
                    >
                        <LAccessGridToggle
                            :permission="permission"
                            :role="role"
                        />
                    </td>
                    <td class="filler" />
                </tr>
                <tr>
                    <th class="permission">
                        <LInput
                            v-model="newPermission"
                            placeholder="+ Permission"
                            small
                            transparent
                            @enter="addNewPermission"
                        />
                    </th>
                </tr>
            </tbody>
        </table>
    </LCard>
</template>

<script setup lang="ts">
import { faLock, faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { alert, confirm, LButton, LCard, LFloating, LIcon, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { ref } from "vue";

import LAccessGridToggle from "@/components/access/LAccessGridToggle.vue";
import { addPermission, addRole, internals } from "@/internals";

const newRole = ref("");
const newPermission = ref("");

async function addNewRole(hide: () => void) {
    const label = newRole.value.trim();

    if (!label) {
        return;
    }

    if (!addRole({ id: kebabCase(label) || crypto.randomUUID(), label, permissions: [] })) {
        await alert(`Role "${ label }" already exists.`);
        return;
    }

    newRole.value = "";
    hide();
}

async function addNewPermission() {
    const label = newPermission.value.trim();

    if (!label) {
        return;
    }

    if (!addPermission({ id: kebabCase(label) || crypto.randomUUID(), label })) {
        await alert(`Permission "${ label }" already exists.`);
        return;
    }

    newPermission.value = "";
}

async function deleteRole(roleId: string) {
    if (!await confirm(`Are you sure you want to delete the role "${ internals.roles[roleId]?.label }"?`)) {
        return;
    }

    delete internals.roles[roleId];
}

async function deletePermission(permissionId: string) {
    if (!await confirm(`Are you sure you want to delete the permission "${ internals.permissions[permissionId]?.label }"?`)) {
        return;
    }

    delete internals.permissions[permissionId];
}
</script>

<style scoped>
.access {
    --cell-size: 36px;
    --label-length: 110px;

    overflow-x: auto;

    table {
        min-width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: var(--length-xxs) var(--length-xs);
        border-bottom: 1px solid var(--color-background-2);
        font-weight: normal;
    }

    thead th {
        border-bottom-color: var(--color-background-2);
    }

    tbody tr:last-child th,
    tbody tr:last-child td {
        border-bottom: none;
    }

    .permission {
        width: 200px;
        min-width: 160px;
        height: var(--cell-size);
        padding-block: 0;
    }

    td {
        width: var(--cell-size);
        min-width: var(--cell-size);
        height: var(--cell-size);
        padding: 0;
        border-left: 1px solid var(--color-background-2);
    }

    .role.add,
    .filler {
        width: 100%;
        min-width: calc(var(--label-length) * 0.71 + var(--cell-size));
    }

    .role {
        position: relative;
        width: var(--cell-size);
        min-width: var(--cell-size);
        height: calc(var(--label-length) * 0.71 + var(--length-s));
        padding: 0;

        .anchor {
            position: absolute;
            bottom: var(--length-xs);
            left: calc(var(--cell-size) / 2);
            transform: rotate(-45deg);
            transform-origin: bottom left;
        }

        .label {
            display: flex;
            align-items: center;
            gap: var(--length-xxs);
            max-width: var(--label-length);
            padding: var(--length-xxxs) var(--length-xxs);
            border: none;
            border-radius: var(--length-radius-xs);
            background: none;
            color: var(--color-content);
            font: inherit;
            font-size: var(--font-size-s);
            white-space: nowrap;
            cursor: pointer;

            &:hover {
                background: var(--color-background-2);
            }

            &.add {
                color: var(--color-content-liter);
            }

            .text {
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .lock {
                flex: 0 0 auto;
                font-size: var(--font-size-xxs);
                color: var(--color-content-liter);
            }
        }
    }

    .cell {
        display: flex;
        align-items: center;
        gap: var(--length-xxxs);

        .delete {
            opacity: 0;
        }

        &:hover .delete,
        .delete:focus-visible {
            opacity: 1;
        }
    }
}

.role-editor {
    display: flex;
    flex-direction: column;
    gap: var(--length-xs);
    width: 200px;
    padding: var(--length-xs);

    .hint {
        font-size: var(--font-size-xs);
        color: var(--color-content-liter);
    }
}
</style>
