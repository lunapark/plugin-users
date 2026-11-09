<template>
    <div>
        {{ status }}
    </div>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core";
import { onMounted, ref } from "vue";

import { getLoopbackRedirect } from "@/editor/oauth.ts";

const status = ref("Loading...");

onMounted(async () => {
    const { code, error, error_description: errorDescription, state } = useUrlSearchParams();

    if (!window.opener) {
        const redirect = getLoopbackRedirect(window.location.search);

        if (redirect) {
            status.value = "Returning to Luna Park...";
            window.location.replace(redirect);
            return;
        }

        status.value = "Error: No opener window found.";
        return;
    }

    window.opener.postMessage({ code, state }, window.location.origin);

    if (!code) {
        status.value = `Error: ${ errorDescription ?? error ?? "No code received from OAuth provider." }`;
        return;
    }

    status.value = "Code received. You can now close this window.";
    window.close();
});
</script>

<style scoped>

</style>
