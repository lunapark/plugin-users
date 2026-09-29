import { argon2id, argon2Verify } from "hash-wasm";

export type THashOptions = {
    hashLength: number;
    iterations: number;
    memory: number;
    parallelism: number;
};

const defaultHashOptions: THashOptions = { hashLength: 64, iterations: 256, memory: 2048, parallelism: 1 };

export async function hashPassword(password: string, options = defaultHashOptions) {
    const salt = new Uint8Array(64);
    crypto.getRandomValues(salt);

    return await argon2id({
        hashLength: options.hashLength,
        iterations: options.iterations,
        memorySize: options.memory,
        outputType: "encoded",
        parallelism: options.parallelism,
        password,
        salt
    });
}

export async function verifyPassword(password: string, hash: string) {
    return await argon2Verify({ hash, password });
}

export function generateHexToken(length = 32) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
