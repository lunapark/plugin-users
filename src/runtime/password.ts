import type { TPasswordPolicy } from "@/internals/general.ts";
import { EPasswordStrength } from "@/internals/general.ts";

const passwordRules = {
    letter: { label: "a letter", pattern: /\p{L}/u },
    lowercase: { label: "a lowercase letter", pattern: /\p{Ll}/u },
    number: { label: "a number", pattern: /\p{N}/u },
    special: { label: "a special character", pattern: /[^\p{L}\p{N}]/u },
    uppercase: { label: "an uppercase letter", pattern: /\p{Lu}/u }
};

const strengthRules: Record<EPasswordStrength, Array<keyof typeof passwordRules>> = {
    [EPasswordStrength.any]: [],
    [EPasswordStrength.alphanumeric]: ["letter", "number"],
    [EPasswordStrength.mixedCase]: ["lowercase", "uppercase", "number"],
    [EPasswordStrength.special]: ["lowercase", "uppercase", "number", "special"]
};

export function getPasswordError(password: string, { minLength, strength }: TPasswordPolicy) {
    if (password.length < minLength) {
        return `Password must be at least ${ minLength } characters long.`;
    }

    const missing = strengthRules[strength].filter((rule) => !passwordRules[rule].pattern.test(password));

    return missing.length ? `Password must contain ${ missing.map((rule) => passwordRules[rule].label).join(", ") }.` : "";
}
