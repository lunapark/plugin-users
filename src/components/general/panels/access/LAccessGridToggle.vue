<template>
    <LCheckbox
        v-model="value"
        borderless
    />
</template>

<script setup lang="ts">
import { LCheckbox } from "@luna-park/design";
import { computed } from "vue";

import type { TPermission, TRole } from "@/internals/roles.ts";

const props = defineProps<{
    permission: TPermission;
    role: TRole;
}>();

const value = computed({
    get: () => props.role.permissions.includes(props.permission.id),
    set: (value: boolean) => {
        if (value) {
            props.role.permissions.push(props.permission.id);
        }
        else {
            props.role.permissions = props.role.permissions.filter((id) => id !== props.permission.id);
        }
    }
});
</script>

<style scoped>

</style>
