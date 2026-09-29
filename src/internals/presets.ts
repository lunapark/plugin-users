import { EIdentifierType } from "@/internals/general.ts";

export type TProviderPreset = {
    id: string;
    api: {
        id: string;
        url: string;
        value: Record<EIdentifierType, string>;
    };
    console: {
        label: string;
        url: string;
    };
    label: string;
    notes?: Array<string>;
    scope: string;
    steps: Array<string>;
    url: {
        authorization: string;
        token: string;
    };
};

export const providerPresets: Array<TProviderPreset> = [
    {
        id: "google",
        api: {
            id: "sub",
            url: "https://openidconnect.googleapis.com/v1/userinfo",
            value: { [EIdentifierType.email]: "email", [EIdentifierType.username]: "email" }
        },
        console: {
            label: "Google Cloud Console",
            url: "https://console.cloud.google.com/apis/credentials"
        },
        label: "Google",
        notes: ["While the consent screen is in \"Testing\" mode, only the test users you list can sign in. Publish it to open sign-in to every Google account."],
        scope: "openid email profile",
        steps: [
            "Configure the OAuth consent screen (External, with the \"email\", \"profile\" and \"openid\" scopes).",
            "Create credentials → OAuth client ID → Web application.",
            "Add the redirect URIs below to \"Authorized redirect URIs\".",
            "Paste the client ID and client secret below."
        ],
        url: {
            authorization: "https://accounts.google.com/o/oauth2/v2/auth",
            token: "https://oauth2.googleapis.com/token"
        }
    },
    {
        id: "discord",
        api: {
            id: "id",
            url: "https://discord.com/api/users/@me",
            value: { [EIdentifierType.email]: "email", [EIdentifierType.username]: "username" }
        },
        console: {
            label: "Discord Developer Portal",
            url: "https://discord.com/developers/applications"
        },
        label: "Discord",
        scope: "identify email",
        steps: [
            "Create a new application.",
            "Open the OAuth2 tab and add the redirect URIs below to \"Redirects\".",
            "Copy the client ID, then reset and copy the client secret, and paste them below."
        ],
        url: {
            authorization: "https://discord.com/oauth2/authorize",
            token: "https://discord.com/api/oauth2/token"
        }
    },
    {
        id: "github",
        api: {
            id: "id",
            url: "https://api.github.com/user",
            value: { [EIdentifierType.email]: "email", [EIdentifierType.username]: "login" }
        },
        console: {
            label: "GitHub Developer Settings",
            url: "https://github.com/settings/developers"
        },
        label: "GitHub",
        notes: ["GitHub only returns an email when the user made it public. Use the \"Username\" identifier for reliable GitHub sign-in."],
        scope: "read:user user:email",
        steps: [
            "Create a new OAuth App (one per environment: GitHub allows a single callback URL per app).",
            "Set the \"Authorization callback URL\" to the redirect URI below.",
            "Generate a client secret, then paste the client ID and secret below."
        ],
        url: {
            authorization: "https://github.com/login/oauth/authorize",
            token: "https://github.com/login/oauth/access_token"
        }
    },
    {
        id: "microsoft",
        api: {
            id: "sub",
            url: "https://graph.microsoft.com/oidc/userinfo",
            value: { [EIdentifierType.email]: "email", [EIdentifierType.username]: "email" }
        },
        console: {
            label: "Microsoft Entra admin center",
            url: "https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade"
        },
        label: "Microsoft",
        scope: "openid email profile",
        steps: [
            "Register a new application, allowing \"Accounts in any organizational directory and personal Microsoft accounts\".",
            "Under Authentication, add a \"Web\" platform with the redirect URIs below.",
            "Under Certificates & secrets, create a client secret.",
            "Paste the Application (client) ID and the secret value below."
        ],
        url: {
            authorization: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            token: "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        }
    },
    {
        id: "gitlab",
        api: {
            id: "id",
            url: "https://gitlab.com/api/v4/user",
            value: { [EIdentifierType.email]: "email", [EIdentifierType.username]: "username" }
        },
        console: {
            label: "GitLab Applications",
            url: "https://gitlab.com/-/user_settings/applications"
        },
        label: "GitLab",
        scope: "read_user",
        steps: [
            "Add a new application with the \"read_user\" scope.",
            "Add the redirect URIs below (one per line).",
            "Paste the application ID and secret below."
        ],
        url: {
            authorization: "https://gitlab.com/oauth/authorize",
            token: "https://gitlab.com/oauth/token"
        }
    }
];

export function getProviderPreset(presetId?: string) {
    return providerPresets.find((preset) => preset.id === presetId);
}
