<template>
    <div class="grid">
        <h3>Access Grid</h3>
        <table>
            <tbody>
                <tr>
                    <th />
                    <th
                        v-for="role of internals.roles"
                        :key="role.id"
                    >
                        <span :title="role.label">{{ role.label }}</span>
                    </th>
                </tr>
                <tr
                    v-for="permission of internals.permissions"
                    :key="permission.id"
                >
                    <th>
                        <span :title="permission.label">{{ permission.label }}</span>
                    </th>
                    <td
                        v-for="role of internals.roles"
                        :key="role.id"
                    >
                        <LAccessGridToggle
                            :permission="permission"
                            :role="role"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">

import LAccessGridToggle from "@/components/general/panels/access/LAccessGridToggle.vue";
import { internals } from "@/internals";
</script>

<style scoped>
.grid {
    background-color: var(--color-background-dark);
    padding: var(--length-m);
    border-radius: var(--length-radius-s);
    border: 1px solid var(--color-soft-lite);

    h3 {
        font-size: var(--font-size-s);
        color: var(--color-content-lite);
    }

    table {
        td, th {
            padding: var(--length-xxs);
        }

        tr:first-child {
            th {
                span {
                    display: block;
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    text-align: left;
                    height: 64px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }

        th {
            text-align: right;
            font-size: var(--font-size-s);
            font-weight: normal;
        }
    }
}
</style>
