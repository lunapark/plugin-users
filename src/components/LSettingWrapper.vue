<template>
    <div class="setting-wrapper">
        <div class="menu">
            <slot name="menu" />
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.setting-wrapper {
    display: flex;
    height: 100%;
    overflow: hidden;

    .menu {
        flex: 0 0 196px;
        overflow-y: auto;
        background: var(--color-background-dark);
        border-right: 1px solid var(--color-background-2);
        box-sizing: border-box;
    }

    .content {
        flex: 1 1 auto;
        overflow-y: auto;
    }
}
</style>
