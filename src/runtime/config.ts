import type { EIdentifierType, TPasswordPolicy } from "@/internals/general.ts";
import type { TProviderData } from "@/internals/providers.ts";

export type TUserRecord = {
    id: string;
    auth: Record<string, string>;
    login: string;
    password?: string;
    roles: Array<string>;
};

export type TSessionRecord = {
    id: string;
    created_at?: Date | string | number;
    expires: Date | string | number;
    token: string;
    user: string;
};

export type TPublicUser = Pick<TUserRecord, "id" | "login" | "roles">;

type TTable<TRecord> = {
    delete: (filter: Record<string, unknown>) => Promise<unknown>;
    find: (filter: Record<string, unknown>) => Promise<Array<TRecord>>;
    insert: (data: Record<string, unknown>) => Promise<TRecord>;
    update: (filter: Record<string, unknown>, data: Record<string, unknown>) => Promise<unknown>;
};

export type TUsersRuntimeOptions = {
    config: {
        identifier: EIdentifierType;
        password: TPasswordPolicy;
        providers: Record<string, TProviderData>;
        roles: Record<string, Array<string>>;
    };
    cookies: {
        clear: (key: string) => void;
        get: (key: string) => string | undefined;
        set: (key: string, value: string) => void;
    };
    db: {
        sessions: TTable<TSessionRecord>;
        users: TTable<TUserRecord> & {
            findByAuth: (providerId: string, id: string) => Promise<Array<TUserRecord>>;
        };
    };
    secret: string;
};

export enum ECookiesKey {
    Session = "session"
}

let runtime: TUsersRuntimeOptions | undefined;

export function configureUsers(options: TUsersRuntimeOptions) {
    runtime = options;
}

export function getRuntime() {
    if (!runtime) {
        throw new Error("Users plugin runtime is not configured.");
    }

    return runtime;
}
