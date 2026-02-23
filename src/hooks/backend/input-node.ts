import { EPluginHooks, LogicType, type THookParams } from "@luna-park/plugin";

export function backendInputNode(params: THookParams[EPluginHooks.BackendInputNode]) {
    params.addInput("in_user", LogicType.object({
        roles: LogicType.array(LogicType.string())
    }, {
        name: "user",
        optional: true
    }));
}
