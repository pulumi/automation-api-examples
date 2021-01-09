import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as mod from ".";
import * as x from "..";
export declare abstract class LoadBalancer extends pulumi.ComponentResource {
    readonly loadBalancer: aws.lb.LoadBalancer;
    readonly vpc: x.ec2.Vpc;
    readonly securityGroups: x.ec2.SecurityGroup[];
    readonly listeners: mod.Listener[];
    readonly targetGroups: mod.TargetGroup[];
    constructor(type: string, name: string, args: LoadBalancerArgs, opts: pulumi.ComponentResourceOptions);
    /**
     * Attaches a target to the first `listener` of this LoadBalancer.  If there are multiple
     * `listeners` you can add a target to specific listener to by calling `.attachTarget` directly
     * on it.
     */
    attachTarget(name: string, args: LoadBalancerTarget, opts?: pulumi.CustomResourceOptions): mod.TargetGroupAttachment;
}
export interface LoadBalancerArgs {
    /**
     * An existing aws.lb.LoadBalancer to use for this awsx.lb.LoadBalancer.
     * If this value is set then all other arguments are ignored.
     * If not provided, one will be created.
     */
    loadBalancer?: aws.lb.LoadBalancer;
    /**
     * The vpc this load balancer will be used with.  Defaults to `[Vpc.getDefault]` if
     * unspecified.
     */
    vpc?: x.ec2.Vpc;
    /**
     * @deprecated Not used.  Supply the name you want for a LoadBalancer through the [name]
     * constructor arg.
     */
    name?: string;
    /**
     * Whether or not the load balancer is exposed to the internet. Defaults to `true` if
     * unspecified.
     */
    external?: boolean;
    /**
     * The type of load balancer to create. Possible values are `application` or `network`.
     */
    loadBalancerType: pulumi.Input<"application" | "network">;
    /**
     * If true, deletion of the load balancer will be disabled via the AWS API. This will prevent
     * Terraform from deleting the load balancer. Defaults to `false`.
     */
    enableDeletionProtection?: pulumi.Input<boolean>;
    /**
     * The type of IP addresses used by the subnets for your load balancer. The possible values are
     * `ipv4` and `dualstack`
     */
    ipAddressType?: pulumi.Input<"ipv4" | "dualstack">;
    /**
     * The subnets to use for the load balancer.  If not provided, the appropriate external or
     * internal subnets of the [network] will be used.
     */
    subnets?: pulumi.Input<pulumi.Input<string>[]> | LoadBalancerSubnets;
    /**
     * A subnet mapping block as documented below.
     */
    subnetMappings?: aws.lb.LoadBalancerArgs["subnetMappings"];
    /**
     * A mapping of tags to assign to the resource.
     */
    tags?: pulumi.Input<aws.Tags>;
    /**
     * A list of security group IDs to assign to the LB. Only valid for Load Balancers of type
     * `application`.
     */
    securityGroups?: x.ec2.SecurityGroupOrId[];
}
export interface LoadBalancerSubnets {
    subnets(): pulumi.Input<pulumi.Input<string>[]>;
}
export interface LoadBalancerTargetInfo {
    /**
     * The ID of the target. This is the Instance ID for an `instance`, or the container ID for an
     * ECS container. If the target type is `ip`, specify an IP address. If the target type is
     * `lambda`, specify the arn of lambda.
     */
    targetId: string;
    /**
     * The Availability Zone where the IP address of the target is to be registered.
     */
    availabilityZone?: string;
    /**
     * The port on which targets receive traffic.
     */
    port?: number;
}
export interface LoadBalancerTargetInfoProvider {
    loadBalancerTargetInfo(targetType: pulumi.Input<mod.TargetType>): pulumi.Output<LoadBalancerTargetInfo>;
}
export declare function isLoadBalancerTargetInfoProvider(obj: any): obj is LoadBalancerTargetInfoProvider;
/**
 * The types of things that can be the target of a load balancer.
 *
 * Note: A lambda event handler can only be supplied if using an application load balancer.
 */
export declare type LoadBalancerTarget = pulumi.Input<LoadBalancerTargetInfo> | LoadBalancerTargetInfoProvider | aws.ec2.Instance | aws.lambda.EventHandler<x.apigateway.Request, x.apigateway.Response>;
