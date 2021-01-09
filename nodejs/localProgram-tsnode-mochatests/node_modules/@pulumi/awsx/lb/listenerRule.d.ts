import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
/**
 * The rules that you define for your listener determine how the load balancer routes requests to
 * the targets in one or more target groups.
 *
 * Each rule consists of a priority, one or more actions, an optional host condition, and an
 * optional path condition. For more information, see
 * https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html
 */
export declare class ListenerRule extends pulumi.ComponentResource {
    readonly listenerRule: aws.lb.ListenerRule;
    constructor(name: string, listener: x.lb.Listener, args: ListenerRuleArgs, opts?: pulumi.ComponentResourceOptions);
}
export interface ListenerRuleArgs {
    /**
     * An Action block. Action blocks are documented below.
     */
    actions: aws.lb.ListenerRuleArgs["actions"] | x.lb.ListenerActions;
    /**
     * A Condition block. Condition blocks are documented below.
     */
    conditions: aws.lb.ListenerRuleArgs["conditions"];
    /**
     * The priority for the rule between `1` and `50000`. Leaving it unset will automatically set the rule with next available priority after currently existing highest rule. A listener can't have multiple rules with the same priority.
     */
    priority?: pulumi.Input<number>;
}
