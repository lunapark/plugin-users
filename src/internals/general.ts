export enum EIdentifierType {
    email = "email",
    username = "username"
}

export enum EPasswordStrength {
    any = "any",
    alphanumeric = "alphanumeric",
    mixedCase = "mixed-case",
    special = "special"
}

export type TPasswordPolicy = {
    minLength: number;
    strength: EPasswordStrength;
};

export type TGeneralSettings = {
    identifier: EIdentifierType;
    password: TPasswordPolicy;
};

export function getDefaultPasswordPolicy(): TPasswordPolicy {
    return { minLength: 8, strength: EPasswordStrength.any };
}
