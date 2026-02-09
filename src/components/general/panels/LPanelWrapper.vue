<template>
    <div class="panel-wrapper">
        <slot />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.panel-wrapper {
    padding: var(--length-s);
    display: flex;
    flex-direction: column;
    gap: var(--length-s);

    &:deep(h2) {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        font-weight: 600;
        color: var(--color-content-liter);
        margin-top: var(--length-s);

        &:first-child {
            margin-top: 0;
        }
    }

    &:deep(.label) {
        color: var(--color-content-lite);
    }
}
</style>
