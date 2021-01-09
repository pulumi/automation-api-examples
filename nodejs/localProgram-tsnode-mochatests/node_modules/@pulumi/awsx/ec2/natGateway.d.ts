import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export declare class NatGateway extends pulumi.ComponentResource implements x.ec2.SubnetRouteProvider {
    readonly natGatewayName: string;
    readonly vpc: x.ec2.Vpc;
    readonly elasticIP: aws.ec2.Eip | undefined;
    readonly natGateway: aws.ec2.NatGateway;
    constructor(name: string, vpc: x.ec2.Vpc, args: NatGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    constructor(name: string, vpc: x.ec2.Vpc, args: ExistingNatGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    route(name: string, opts: pulumi.ComponentResourceOptions): x.ec2.RouteArgs;
}
export interface NatGatewayArgs {
    /**
     * The subnet the NatGateway should be placed in.
     */
    subnet: x.ec2.SubnetOrId;
    /**
     * A mapping of tags to assign to the resource.
     */
    tags?: pulumi.Input<{
        [key: string]: any;
    }>;
}
export interface ExistingNatGatewayArgs {
    natGateway: aws.ec2.NatGateway;
}
