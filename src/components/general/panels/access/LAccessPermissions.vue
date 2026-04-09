<template>
    <div
        class="permissions"
        :class="{ 'drop-at-end': dropAtEnd }"
    >
        <h3>Permissions</h3>
        <div
            v-for="(permission, id, index) of internals.permissions"
            :key="id"
            class="permission"
            draggable="true"
            :class="{
                dragging: draggingPermissionId === id,
                'drop-before': dropBeforePermissionId === id && draggingPermissionId !== id
            }"
            @dragstart="onPermissionDragStart($event, id)"
            @dragend="onPermissionDragEnd"
            @dragover.prevent="onPermissionDragOver($event, index)"
            @drop.prevent="onPermissionDrop"
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
                :model-value="permission.label"
                small
            />
            <LButton
                borderless
                :icon="faTrash"
                small
                square
                @click="deletePermission(id)"
            />
        </div>
        <div class="permission new-permission">
            <LInput
                v-model="newPermission"
                borderless
                placeholder="New Permission..."
                small
            />
            <LButton
                borderless
                :disabled="!newPermission"
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
import { LButton, LInput } from "@luna-park/design";
import { kebabCase } from "es-toolkit";
import { ref } from "vue";

import { addPermission, internals } from "@/internals";

const newPermission = ref("");
const draggingPermissionId = ref<string | null>(null);
const dropBeforePermissionId = ref<string | null>(null);
const dropAtEnd = ref(false);

function addNewPermission() {
    addPermission({
        id: kebabCase(newPermission.value),
        label: newPermission.value
    });
}

function deletePermission(permissionId: string) {
    if (!confirm(`Are you sure you want to delete the permission "${ internals.permissions[permissionId]?.label }"?`)) {
        return;
    }

    delete internals.permissions[permissionId];
}

function onPermissionDragStart(event: DragEvent, permissionId: string) {
    draggingPermissionId.value = permissionId;

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return;
    }

    dataTransfer.setData("text/plain", permissionId);
    dataTransfer.setDragImage(event.currentTarget as Element, 16, 16);
    dataTransfer.dropEffect = "move";
    dataTransfer.effectAllowed = "move";
}

function onPermissionDragEnd() {
    draggingPermissionId.value = null;
    dropBeforePermissionId.value = null;
    dropAtEnd.value = false;
}

function onPermissionDragOver(event: DragEvent, targetIndex: number) {
    const permissionIds = Object.keys(internals.permissions);
    const target = event.currentTarget as HTMLElement | null;

    if (!target || !permissionIds.length) {
        return;
    }

    const { height, top } = target.getBoundingClientRect();
    const insertAfter = event.clientY > top + height / 2;
    const insertionIndex = insertAfter ? targetIndex + 1 : targetIndex;
    const nextPermissionId = permissionIds[insertionIndex] ?? null;

    dropBeforePermissionId.value = nextPermissionId;
    dropAtEnd.value = nextPermissionId === null;
}

function onPermissionDrop() {
    if (!draggingPermissionId.value) {
        return;
    }

    moveRecordEntryBefore(internals.permissions, draggingPermissionId.value, dropBeforePermissionId.value);
    draggingPermissionId.value = null;
    dropBeforePermissionId.value = null;
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

        &.new-permission {
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
        .new-permission::before {
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
