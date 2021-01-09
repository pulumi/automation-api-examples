import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as mod from ".";
export declare class TargetGroupAttachment extends pulumi.ComponentResource {
    readonly targetGroupAttachment: aws.lb.TargetGroupAttachment;
    readonly permission?: aws.lambda.Permission;
    readonly func?: aws.lambda.Function;
    constructor(name: string, targetGroup: mod.TargetGroup, args: mod.LoadBalancerTarget, opts?: pulumi.ComponentResourceOptions);
}
export interface TargetGroupAttachmentArgs {
    /**
     * The Availability Zone where the IP address of the target is to be registered.
     */
    availabilityZone?: pulumi.Input<string>;
    /**
     * The port on which targets receive traffic.
     */
    port?: pulumi.Input<number>;
    /**
     * The ID of the target. This is the Instance ID for an instance, or the container ID for an ECS container. If the target type is ip, specify an IP address. If the target type is lambda, specify the arn of lambda.
     */
    targetId: pulumi.Input<string>;
    /**
     * Optional function this target group attachment targets.
     */
    func?: aws.lambda.Function;
}
