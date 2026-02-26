export type TProviderData = {
    api: {
        id: string;
        url: string;
        value: string;
    };
    client: {
        id: string;
        secret: string;
    };
    url: {
        authorization: string;
        redirect: string;
        token: string;
    };
};

export function createProviderData(): TProviderData {
    return {
        api: {
            id: "",
            url: "",
            value: ""
        },
        client: {
            id: "",
            secret: ""
        },
        url: {
            authorization: "",
            redirect: "",
            token: ""
        }
    };
}

export type TProvider = {
    id: string;
    data: {
        development: TProviderData;
        production: TProviderData;
    };
    label: string;
};

export function createProvider(): TProvider {
    return {
        id: crypto.randomUUID(),
        data: {
            development: createProviderData(),
            production: createProviderData()
        },
        label: "New provider"
    };
}
