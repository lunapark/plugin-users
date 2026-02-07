<template>
    <div class="histoire-wrapper">
        <slot />
        <LToastInjector />
        <LDialogInjector />
    </div>
</template>

<script setup lang="ts">
import { LDialogInjector, LToastInjector } from "@luna-park/design";
</script>

<style scoped>

</style>
