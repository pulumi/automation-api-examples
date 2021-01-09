import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export declare class InternetGateway extends pulumi.ComponentResource implements x.ec2.SubnetRouteProvider {
    readonly vpc: x.ec2.Vpc;
    readonly internetGateway: aws.ec2.InternetGateway;
    constructor(name: string, vpc: x.ec2.Vpc, args: aws.ec2.InternetGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    constructor(name: string, vpc: x.ec2.Vpc, args: ExistingInternetGatewayArgs, opts?: pulumi.ComponentResourceOptions);
    route(name: string, opts: pulumi.ComponentResourceOptions): x.ec2.RouteArgs;
}
export interface ExistingInternetGatewayArgs {
    /**
     * Optional existing instance to use to make the [awsx.ec2.InternetGateway] out of.
     */
    internetGateway: aws.ec2.InternetGateway;
}
