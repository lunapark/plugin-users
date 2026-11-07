<template>
    <Story title="Users workspace">
        <Variant title="Sign-in">
            <div class="frame">
                <LSignInSection />
            </div>
        </Variant>
        <Variant title="Password">
            <div class="frame">
                <LPasswordSection />
            </div>
        </Variant>
        <Variant title="Roles & permissions">
            <div class="frame">
                <LAccessSection />
            </div>
        </Variant>
        <Variant title="OAuth providers">
            <div class="frame">
                <LOAuthSection />
            </div>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import LAccessSection from "@/components/access/LAccessSection.vue";
import LPasswordSection from "@/components/general/LPasswordSection.vue";
import LSignInSection from "@/components/general/LSignInSection.vue";
import LOAuthSection from "@/components/oauth/LOAuthSection.vue";
</script>

<style scoped>
.frame {
    max-width: 800px;
    padding: var(--length-l);
}
</style>
