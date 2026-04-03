<template>
    <div
        class="roles"
        :class="{ 'drop-at-end': dropAtEnd }"
    >
        <h3>Roles</h3>
        <div
            v-for="(role, id, index) of internals.roles"
            :key="id"
            class="role"
            draggable="true"
            :class="{
                dragging: draggingRoleId === id,
                'drop-before': dropBeforeRoleId === id && draggingRoleId !== id
            }"
            @dragstart="onRoleDragStart($event, id)"
            @dragend="onRoleDragEnd"
            @dragover.prevent="onRoleDragOver($event, index)"
            @drop.prevent="onRoleDrop"
        >
            <span
                class="drag-handle"
                title="Drag to reorder"
            >
                ::
            </span>
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
        <div class="role new-role">
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
const draggingRoleId = ref<string | null>(null);
const dropBeforeRoleId = ref<string | null>(null);
const dropAtEnd = ref(false);

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

function onRoleDragStart(event: DragEvent, roleId: string) {
    draggingRoleId.value = roleId;

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return;
    }

    dataTransfer.setData("text/plain", roleId);
    dataTransfer.setDragImage(event.currentTarget as Element, 16, 16);
    dataTransfer.dropEffect = "move";
    dataTransfer.effectAllowed = "move";
}

function onRoleDragEnd() {
    draggingRoleId.value = null;
    dropBeforeRoleId.value = null;
    dropAtEnd.value = false;
}

function onRoleDragOver(event: DragEvent, targetIndex: number) {
    const roleIds = Object.keys(internals.roles);
    const target = event.currentTarget as HTMLElement | null;

    if (!target || !roleIds.length) {
        return;
    }

    const { height, top } = target.getBoundingClientRect();
    const insertAfter = event.clientY > top + height / 2;
    const insertionIndex = insertAfter ? targetIndex + 1 : targetIndex;
    const nextRoleId = roleIds[insertionIndex] ?? null;

    dropBeforeRoleId.value = nextRoleId;
    dropAtEnd.value = nextRoleId === null;
}

function onRoleDrop() {
    if (!draggingRoleId.value) {
        return;
    }

    moveRecordEntryBefore(internals.roles, draggingRoleId.value, dropBeforeRoleId.value);
    draggingRoleId.value = null;
    dropBeforeRoleId.value = null;
    dropAtEnd.value = false;
}

function moveRecordEntryBefore<T extends { id: string }>(
    record: Record<string, T>,
    sourceId: string,
    beforeId: string | null
) {
    if (sourceId === beforeId) {
        return;
    }

    const entries = Object.entries(record);
    const sourceIndex = entries.findIndex(([id]) => id === sourceId);
    if (sourceIndex === -1) {
        return;
    }

    const [sourceEntry] = entries.splice(sourceIndex, 1);
    const insertionIndex = beforeId ? entries.findIndex(([id]) => id === beforeId) : entries.length;
    const safeInsertionIndex = insertionIndex === -1 ? entries.length : insertionIndex;

    entries.splice(safeInsertionIndex, 0, sourceEntry);

    for (const id of Object.keys(record)) {
        delete record[id];
    }

    for (const [id, value] of entries) {
        record[id] = value;
    }
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
        cursor: grab;
        position: relative;
        border-radius: var(--length-radius-xs);
        transition: background-color 0.12s ease;

        &.dragging {
            opacity: 0.45;
        }

        &.drop-before {
            background-color: color-mix(in srgb, #3f8cff 10%, transparent);

            &::before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: -4px;
                height: 3px;
                border-radius: 999px;
                background: linear-gradient(90deg, #3f8cff 0%, #66a3ff 100%);
            }
        }

        .drag-handle {
            align-items: center;
            color: var(--color-content-softer);
            display: inline-flex;
            font-size: var(--font-size-s);
            justify-content: center;
            min-width: 16px;
            user-select: none;
        }

        &.new-role {
            cursor: default;
            position: relative;

            .drag-handle {
                display: none;
            }
        }

        &:deep(.input) {
            flex: 1 1 0;
        }
    }

    &.drop-at-end {
        .new-role::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: -4px;
            height: 3px;
            border-radius: 999px;
            background: linear-gradient(90deg, #3f8cff 0%, #66a3ff 100%);
        }
    }
}
</style>
