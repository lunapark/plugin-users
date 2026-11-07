<template>
    <LCard>
        <LSettingRow
            description="Minimum number of characters a password must contain."
            title="Minimum length"
        >
            <LInput
                v-model="internals.general.password.minLength"
                :options="{ clamp: true, min: 1, step: 1 }"
                small
                type="number"
            />
        </LSettingRow>
        <LSettingRow
            description="Kinds of characters a password must contain."
            title="Strength"
        >
            <LDropdown
                v-model="internals.general.password.strength"
                :options="strengthOptions"
                small
            />
        </LSettingRow>
    </LCard>
</template>

<script setup lang="ts">
import { LCard, LDropdown, LInput, LSettingRow } from "@luna-park/design";

import { internals } from "@/internals";
import { EPasswordStrength } from "@/internals/general.ts";

const strengthOptions = [
    { description: "Any characters", label: "Any", value: EPasswordStrength.any },
    { description: "Letters and numbers", label: "Letters + numbers", value: EPasswordStrength.alphanumeric },
    { description: "Upper and lower case letters, and numbers", label: "Mixed case + numbers", value: EPasswordStrength.mixedCase },
    { description: "Upper and lower case letters, numbers, and special characters", label: "Mixed case + symbols", value: EPasswordStrength.special }
];
</script>
