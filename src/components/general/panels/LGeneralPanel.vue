<template>
    <LPanelWrapper class="general-panel">
        <h2>General</h2>
        <section>
            <div>
                <LDropdown
                    v-model="internals.general.identifier"
                    borderless
                    label="Identifier type"
                    :options="options"
                />
                <span class="description">
                    The identifier type used to identify users. This is stored as <code>signup</code> in the database.
                </span>
            </div>
        </section>
    </LPanelWrapper>
</template>

<script setup lang="ts">
import { LDropdown } from "@luna-park/design";

import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
import { internals } from "@/internals";
import { EIdentifierType } from "@/internals/general.ts";

const options = [
    { id: EIdentifierType.email, label: "Email" },
    { id: EIdentifierType.username, label: "Username" }
];
</script>

<style scoped>
.description {
    color: var(--color-content-litest);
    font-size: var(--font-size-s);
}

section {
    display: flex;
    flex-direction: column;
    gap: var(--length-xs);
}
</style>
