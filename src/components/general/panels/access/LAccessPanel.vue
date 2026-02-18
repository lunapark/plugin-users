<template>
    <LPanelWrapper class="roles-panel">
        <h2>Access</h2>
        <LAccessGrid />
        <div class="wrapper">
            <LAccessRoles />
            <LAccessPermissions />
        </div>
    </LPanelWrapper>
</template>

<script setup lang="ts">
import LAccessGrid from "@/components/general/panels/access/LAccessGrid.vue";
import LAccessPermissions from "@/components/general/panels/access/LAccessPermissions.vue";
import LAccessRoles from "@/components/general/panels/access/LAccessRoles.vue";
import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
</script>

<style scoped>
.roles-panel {
    .wrapper {
        display: flex;
        gap: var(--length-s);
    }
}
</style>
