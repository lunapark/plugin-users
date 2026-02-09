export type TMailSettings = {
    auth: {
        password: string;
        user: string;
    };
    host: string;
    port: number;
    secure: boolean;
};
