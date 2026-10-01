import { ELogicScope, LogicType, makeLogicNode } from "@luna-park/plugin";

import { middlewareUserSchema } from "@/hooks/backend/middleware.ts";
import { internals } from "@/internals";
import type { TPasswordPolicy } from "@/internals/general.ts";
import { serverTarget, sharedTarget } from "@/nodes/user.ts";
import { changePassword, createPasswordResetToken, resetPassword } from "@/runtime/account.ts";
import { getPasswordError } from "@/runtime/password.ts";

export default (policy: TPasswordPolicy) => [
    makeLogicNode({
        name: "user/check-password",
        inputs: {
            in_exec: LogicType.exec(),
            in_password: LogicType.string({ name: "Password" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_valid: LogicType.boolean({ name: "valid" }),
            out_error: LogicType.string({ name: "error" })
        },
        display: {
            config: {
                scope: ELogicScope.Shared
            }
        },
        documentation: {
            description: "Check a password against the password policy set in the Users settings. Outputs the reason when it is not strong enough."
        },
        methods: {
            async in_exec() {
                this.out_error = getPasswordError(this.in_password, internals.general.password);
                this.out_valid = !this.out_error;
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_error = getPasswordError(this.in_password, ${ JSON.stringify(policy) });
                this.out_valid = !this.out_error;
                await this.out_exec();
            }`,
            imports: [{ name: "getPasswordError", target: sharedTarget }]
        }
    }),
    makeLogicNode({
        name: "user/change-password",
        inputs: {
            in_exec: LogicType.exec(),
            in_current: LogicType.string({ name: "Current password" }),
            in_password: LogicType.string({ name: "New password" })
        },
        outputs: {
            out_exec: LogicType.exec()
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "Change the connected user's password. Other sessions of this user are logged out."
        },
        methods: {
            async in_exec() {
                await changePassword(this.in_current, this.in_password);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                await changePassword(this.in_current, this.in_password);
                await this.out_exec();
            }`,
            imports: [{ name: "changePassword", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "user/request-password-reset",
        inputs: {
            in_exec: LogicType.exec(),
            in_login: LogicType.string({ name: "Login" })
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_token: LogicType.string({ name: "token" }),
            out_user: middlewareUserSchema
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "Create a password reset token, valid for one hour and usable once. Send it to the user (by email, for example), then pass it to user/reset-password."
        },
        methods: {
            async in_exec() {
                const { token, user } = await createPasswordResetToken(this.in_login);
                this.out_token = token;
                this.out_user = user;
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                const { token, user } = await createPasswordResetToken(this.in_login);
                this.out_token = token;
                this.out_user = user;
                await this.out_exec();
            }`,
            imports: [{ name: "createPasswordResetToken", target: serverTarget }]
        }
    }),
    makeLogicNode({
        name: "user/reset-password",
        inputs: {
            /* eslint-disable sort-keys-custom-order/object-keys */
            in_exec: LogicType.exec(),
            in_token: LogicType.string({ name: "Token" }),
            in_password: LogicType.string({ name: "New password" })
            /* eslint-enable sort-keys-custom-order/object-keys */
        },
        outputs: {
            out_exec: LogicType.exec(),
            out_user: middlewareUserSchema
        },
        display: {
            config: {
                scope: ELogicScope.Backend
            }
        },
        documentation: {
            description: "Set a new password from a reset token. Every session of this user is logged out."
        },
        methods: {
            async in_exec() {
                this.out_user = await resetPassword(this.in_token, this.in_password);
                await this.out_exec();
            }
        },
        build: {
            generate: () => `async function () {
                this.out_user = await resetPassword(this.in_token, this.in_password);
                await this.out_exec();
            }`,
            imports: [{ name: "resetPassword", target: serverTarget }]
        }
    })
];
