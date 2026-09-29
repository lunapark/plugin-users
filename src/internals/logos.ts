import type { Component } from "vue";

import IconDiscord from "~icons/logos/discord-icon";
import IconGithub from "~icons/logos/github-icon";
import IconGitlab from "~icons/logos/gitlab-icon";
import IconGoogle from "~icons/logos/google-icon";
import IconMicrosoft from "~icons/logos/microsoft-icon";

export const providerLogos: Record<string, Component> = {
    discord: IconDiscord,
    github: IconGithub,
    gitlab: IconGitlab,
    google: IconGoogle,
    microsoft: IconMicrosoft
};
