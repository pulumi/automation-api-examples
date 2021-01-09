import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export declare class Subnet extends pulumi.ComponentResource {
    private readonly __isSubnetInstance;
    readonly vpc: x.ec2.Vpc;
    readonly subnetName: string;
    /**
     * Underlying id for the aws subnet.  This should be used over [this.subnet.id] as this
     * Output will only resolve once the route table and all associations are resolved.
     */
    readonly id: pulumi.Output<string>;
    readonly subnet: aws.ec2.Subnet;
    readonly routeTable: aws.ec2.RouteTable | undefined;
    readonly routeTableAssociation: aws.ec2.RouteTableAssociation | undefined;
    readonly routes: aws.ec2.Route[];
    constructor(name: string, vpc: x.ec2.Vpc, args: SubnetArgs, opts?: pulumi.ComponentResourceOptions);
    constructor(name: string, vpc: x.ec2.Vpc, args: ExistingSubnetArgs, opts?: pulumi.ComponentResourceOptions);
    createRoute(name: string, args: RouteArgs, opts?: pulumi.ComponentResourceOptions): void;
    createRoute(name: string, provider: SubnetRouteProvider, opts?: pulumi.ComponentResourceOptions): void;
}
export interface SubnetRouteProvider {
    route(name: string, opts: pulumi.ComponentResourceOptions): RouteArgs;
}
export declare type SubnetOrId = Subnet | pulumi.Input<string>;
export interface ExistingSubnetArgs {
    /**
     * Optional existing instance to use to make the awsx Subnet out of.  If this is provided No
     * RouteTable or RouteTableAssociation will be automatically be created.
     */
    subnet: aws.ec2.Subnet;
}
/**
 * The set of arguments for constructing a Route resource.
 */
export interface RouteArgs {
    /**
     * The destination CIDR block.
     */
    destinationCidrBlock?: pulumi.Input<string>;
    /**
     * The destination IPv6 CIDR block.
     */
    destinationIpv6CidrBlock?: pulumi.Input<string>;
    /**
     * Identifier of a VPC Egress Only Internet Gateway.
     */
    egressOnlyGatewayId?: pulumi.Input<string>;
    /**
     * Identifier of a VPC internet gateway or a virtual private gateway.
     */
    gatewayId?: pulumi.Input<string>;
    /**
     * Identifier of an EC2 instance.
     */
    instanceId?: pulumi.Input<string>;
    /**
     * Identifier of a VPC NAT gateway.
     */
    natGatewayId?: pulumi.Input<string>;
    /**
     * Identifier of an EC2 network interface.
     */
    networkInterfaceId?: pulumi.Input<string>;
    /**
     * Identifier of an EC2 Transit Gateway.
     */
    transitGatewayId?: pulumi.Input<string>;
    /**
     * Identifier of a VPC peering connection.
     */
    vpcPeeringConnectionId?: pulumi.Input<string>;
}
export interface SubnetArgs {
    /**
     * The CIDR block for the subnet.
     */
    cidrBlock: pulumi.Input<string>;
    /**
     * Specify true to indicate that network interfaces created in the specified subnet should be
     * assigned an IPv6 address. Default's to `true` if the Vpc this is associated with has
     * `assignGeneratedIpv6CidrBlock: true`. `false` otherwise.
     */
    assignIpv6AddressOnCreation?: pulumi.Input<boolean>;
    /**
     * The AZ for the subnet.
     */
    availabilityZone?: pulumi.Input<string>;
    /**
     * The AZ ID of the subnet.
     */
    availabilityZoneId?: pulumi.Input<string>;
    /**
     * The IPv6 network range for the subnet,
     * in CIDR notation. The subnet size must use a /64 prefix length.
     */
    ipv6CidrBlock?: pulumi.Input<string>;
    /**
     * Specify true to indicate that instances launched into the subnet should be assigned a public
     * IP address. Default is `false`.
     */
    mapPublicIpOnLaunch?: pulumi.Input<boolean>;
    /**
     * A mapping of tags to assign to the resource.
     */
    tags?: pulumi.Input<aws.Tags>;
    /**
     * Ignore changes to any of the specified properties of the Subnet.
     */
    ignoreChanges?: string[];
}
