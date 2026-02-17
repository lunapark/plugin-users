<template>
    <div>
        {{ status }}
    </div>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { onMounted, ref } from "vue";

const status = ref("Loading...");

onMounted(async () => {
    const params = useUrlSearchParams();
    const code = params.code;

    if (!code) {
        status.value = "Error: No code received from OAuth provider.";
        return;
    }

    if (!window.opener) {
        status.value = "Error: No opener window found.";
        return;
    }

    window.opener.postMessage({ code }, window.location.origin);
    status.value = "Code received. You can now close this window.";
    window.close();
});
</script>

<style scoped>

</style>
