<template>
    <LCard>
        <LSettingRow
            description="What users type to sign in. Stored as login in the users table."
            title="Identifier"
        >
            <LDropdown
                :model-value="internals.general.identifier"
                :options="identifierOptions"
                small
                @update:model-value="setIdentifier($event as EIdentifierType)"
            />
        </LSettingRow>
    </LCard>
</template>

<script setup lang="ts">
import { LCard, LDropdown, LSettingRow } from "@luna-park/design";

import { internals, setIdentifier } from "@/internals";
import { EIdentifierType } from "@/internals/general.ts";

const identifierOptions = [
    { label: "Email", value: EIdentifierType.email },
    { label: "Username", value: EIdentifierType.username }
];
</script>
