export type TProviderData = {
    client: {
        id: string;
        secret: string;
    };
    target: {
        url: string;
    };
    token: {
        body: Record<string, string>;
        url: string;
    };
};

export function createProviderData(): TProviderData {
    return {
        client: {
            id: "",
            secret: ""
        },
        target: {
            url: ""
        },
        token: {
            body: {},
            url: ""
        }
    };
}

export type TProvider = {
    data: {
        development: TProviderData;
        production: TProviderData;
    };
    id: string;
    label: string;
};

export function createProvider(): TProvider {
    return {
        data: {
            development: createProviderData(),
            production: createProviderData()
        },
        id: crypto.randomUUID(),
        label: "New provider"
    };
}
