import * as pulumi from "@pulumi/pulumi";
import * as eventRule from "./eventRuleMixins";
/**
 * Creates a CloudWatch event that will fire based on the specified schedule.  This will create
 * an EventRule which will then invoke the provided handler every time it fires.
 */
export declare function onSchedule(name: string, schedule: string, handler: eventRule.EventRuleEventHandler, args?: eventRule.EventRuleEventSubscriptionArgs, opts?: pulumi.ComponentResourceOptions): eventRule.EventRuleEventSubscription;
