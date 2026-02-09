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
                    The identifier type used to identify users. This is stored as <code>login</code> in the database.
                </span>
            </div>
        </section>
        <h2>Mail server</h2>
        <section>
            <span class="description">
                Configure the mail server used to send emails for verification and password reset.
            </span>
            <div class="mail">
                <LInput
                    v-model="internals.mail.host"
                    borderless
                    label="SMTP host"
                    placeholder="smtp.example.com"
                />
                <LInput
                    v-model="internals.mail.port"
                    borderless
                    label="SMTP port"
                    placeholder="465"
                />
                <div class="secure">
                    <label class="label">Use TLS</label>
                    <LCheckbox
                        v-model="internals.mail.secure"
                        borderless
                    />
                </div>
            </div>
            <div class="auth">
                <LInput
                    v-model="internals.mail.auth.user"
                    borderless
                    label="Username"
                    placeholder="username"
                />
                <LInput
                    v-model="internals.mail.auth.password"
                    borderless
                    label="Password"
                    placeholder="********"
                    type="password"
                />
            </div>
        </section>
    </LPanelWrapper>
</template>

<script setup lang="ts">

import { LCheckbox, LDropdown, LInput } from "@luna-park/design";

import LPanelWrapper from "@/components/general/panels/LPanelWrapper.vue";
import type { TInternals } from "@/internals";
import { EIdentifierType } from "@/internals/general.ts";

const props = defineProps<{
    internals: TInternals;
}>();

const options = [
    { id: EIdentifierType.email, value: "Email" },
    { id: EIdentifierType.username, value: "Username" }
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

    .mail {
        display: flex;
        gap: var(--length-xs);

        &:deep(.input) {
            flex: 1 1 auto;
        }

        .secure {
            display: flex;
            flex-direction: column;
            gap: var(--length-xxs);
            font-size: var(--font-size-s);
        }
    }

    .auth {
        display: flex;
        gap: var(--length-xxs);

        &:deep(.input) {
            flex: 1 1 auto;
        }
    }
}
</style>
