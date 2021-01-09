import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export declare function create(resource: pulumi.Resource | undefined, vpcName: string, vpcCidr: string, ipv6CidrBlock: pulumi.Output<string> | undefined, availabilityZones: AvailabilityZoneDescription[], numberOfNatGateways: number, assignGeneratedIpv6CidrBlock: pulumi.Input<boolean>, subnetArgsArray: x.ec2.VpcSubnetArgs[]): VpcTopologyDescription;
