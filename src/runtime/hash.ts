import { argon2id, argon2Verify, createHMAC, createSHA256, sha256 } from "hash-wasm";

export type THashOptions = {
    hashLength: number;
    iterations: number;
    memory: number;
    parallelism: number;
};

export const defaultHashOptions: THashOptions = { hashLength: 32, iterations: 2, memory: 19456, parallelism: 1 };

export async function hashPassword(password: string, options: Partial<THashOptions> = {}) {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

    return await argon2id({
        hashLength: options.hashLength ?? defaultHashOptions.hashLength,
        iterations: options.iterations ?? defaultHashOptions.iterations,
        memorySize: options.memory ?? defaultHashOptions.memory,
        outputType: "encoded",
        parallelism: options.parallelism ?? defaultHashOptions.parallelism,
        password,
        salt
    });
}

export async function verifyPassword(password: string, hash: string) {
    return await argon2Verify({ hash, password });
}

export async function hashToken(token: string) {
    return await sha256(token);
}

export async function signData(key: string, data: string) {
    const hmac = await createHMAC(createSHA256(), key);
    return hmac.init().update(data).digest("hex");
}

export function safeEqual(a: string, b: string) {
    if (a.length !== b.length) {
        return false;
    }

    let difference = 0;

    for (let index = 0; index < a.length; index++) {
        difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
    }

    return difference === 0;
}

export function generateHexToken(length = 32) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
