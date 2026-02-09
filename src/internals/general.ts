export enum EIdentifierType {
    email = "email",
    username = "username"
}

export type TGeneralSettings = {
    identifier: EIdentifierType;
};
