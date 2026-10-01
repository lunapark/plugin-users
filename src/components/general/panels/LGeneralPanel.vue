<template>
    <LPanelWrapper class="general-panel">
        <h2>General</h2>
        <section>
            <div>
                <LDropdown
                    label="Identifier type"
                    :model-value="internals.general.identifier"
                    :options="identifierOptions"
                    @update:model-value="setIdentifier($event as EIdentifierType)"
                />
                <span class="description">
                    The identifier type used to identify users. This is stored as <code>login</code> in the database.
                </span>
            </div>
        </section>
        <h2>Password</h2>
        <section>
            <div>
                <LInput
                    v-model="internals.general.password.minLength"
                    label="Minimum length"
                    :options="{ clamp: true, min: 1, step: 1 }"
                    type="number"
                />
                <span class="description">
                    The minimum number of characters a password must contain.
                </span>
            </div>
            <div>
                <LDropdown
                    v-model="internals.general.password.strength"
                    label="Strength"
                    :options="strengthOptions"
                />
                <span class="description">
                    The kinds of characters a password must contain.
                </span>
            </div>
        </section>
    </LPanelWrapper>
</template>

<script setup lang="ts">
import { LDropdown, LInput } from "@luna-park/design";

import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
import { internals, setIdentifier } from "@/internals";
import { EIdentifierType, EPasswordStrength } from "@/internals/general.ts";

const identifierOptions = [
    { id: EIdentifierType.email, label: "Email" },
    { id: EIdentifierType.username, label: "Username" }
];

const strengthOptions = [
    { id: EPasswordStrength.any, label: "Any characters" },
    { id: EPasswordStrength.alphanumeric, label: "Letters and numbers" },
    { id: EPasswordStrength.mixedCase, label: "Upper and lower case letters, and numbers" },
    { id: EPasswordStrength.special, label: "Upper and lower case letters, numbers, and special characters" }
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
