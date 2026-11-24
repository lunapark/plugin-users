import { LogicType } from "@luna-park/plugin";

export const secretNames = {
    development: "OAUTH_DEV_SECRET",
    production: "OAUTH_SECRET"
};

export const config = LogicType.object({
    oauthProviders: LogicType.record(LogicType.string(), LogicType.object({
        development: LogicType.string({ name: "Development client secret", optional: true, options: { secret: secretNames.development } }),
        production: LogicType.string({ name: "Production client secret", optional: true, options: { secret: secretNames.production } })
    }), { name: "OAuth providers", default: {}, options: { hidden: true } })
});

export type TConfig = typeof config;
