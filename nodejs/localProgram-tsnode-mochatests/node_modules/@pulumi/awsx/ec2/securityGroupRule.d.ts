import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export interface SecurityGroupRuleLocation {
    /**
     * List of CIDR blocks. Cannot be specified with `sourceSecurityGroupId`.
     */
    cidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * List of IPv6 CIDR blocks.
     */
    ipv6CidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The security group id to allow access to/from, depending on the `type`. Cannot be specified
     * with `cidrblocks`.
     */
    sourceSecurityGroupId?: pulumi.Input<string>;
}
export declare type SecurityGroupRuleProtocol = "-1" | "tcp" | "udp" | "icmp";
export interface SecurityGroupRulePorts {
    /**
     * The protocol. If not icmp, tcp, udp, or all use the [protocol
     * number](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)
     */
    protocol: pulumi.Input<SecurityGroupRuleProtocol>;
    /**
     * The start port (or ICMP type number if protocol is "icmp").
     */
    fromPort: pulumi.Input<number>;
    /**
     * The end port (or ICMP code if protocol is "icmp").  Defaults to 'fromPort' if not specified.
     */
    toPort?: pulumi.Input<number>;
}
export declare class AnyIPv4Location implements SecurityGroupRuleLocation {
    readonly cidrBlocks: string[];
}
export declare class AnyIPv6Location implements SecurityGroupRuleLocation {
    readonly ipv6CidrBlocks: string[];
}
export declare class TcpPorts implements SecurityGroupRulePorts {
    readonly fromPort: pulumi.Input<number>;
    readonly toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined;
    readonly protocol = "tcp";
    constructor(fromPort: pulumi.Input<number>, toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined);
}
export declare class AllTcpPorts extends TcpPorts {
    constructor();
}
export declare class UdpPorts implements SecurityGroupRulePorts {
    readonly fromPort: pulumi.Input<number>;
    readonly toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined;
    readonly protocol = "udp";
    constructor(fromPort: pulumi.Input<number>, toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined);
}
export declare class AllUdpPorts extends UdpPorts {
    constructor();
}
export declare class IcmpPorts implements SecurityGroupRulePorts {
    readonly fromPort: pulumi.Input<number>;
    readonly toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined;
    readonly protocol = "icmp";
    constructor(fromPort: pulumi.Input<number>, toPort?: number | Promise<number> | pulumi.OutputInstance<number> | undefined);
}
export declare class AllTraffic implements SecurityGroupRulePorts {
    readonly protocol = "-1";
    readonly fromPort = 0;
    readonly toPort = 0;
}
export declare abstract class SecurityGroupRule extends pulumi.ComponentResource {
    readonly securityGroupRule: aws.ec2.SecurityGroupRule;
    readonly securityGroup: x.ec2.SecurityGroup;
    constructor(type: string, name: string, securityGroup: x.ec2.SecurityGroup, args: SecurityGroupRuleArgs, opts: pulumi.ComponentResourceOptions);
    static egressArgs(destination: SecurityGroupRuleLocation, ports: SecurityGroupRulePorts, description?: pulumi.Input<string>): EgressSecurityGroupRuleArgs;
    static ingressArgs(source: SecurityGroupRuleLocation, ports: SecurityGroupRulePorts, description?: pulumi.Input<string>): IngressSecurityGroupRuleArgs;
    private static createArgs;
    static egress(name: string, securityGroup: x.ec2.SecurityGroup, destination: SecurityGroupRuleLocation, ports: SecurityGroupRulePorts, description?: pulumi.Input<string>, opts?: pulumi.ComponentResourceOptions): x.ec2.EgressSecurityGroupRule;
    static ingress(name: string, securityGroup: x.ec2.SecurityGroup, source: SecurityGroupRuleLocation, ports: SecurityGroupRulePorts, description?: pulumi.Input<string>, opts?: pulumi.ComponentResourceOptions): x.ec2.IngressSecurityGroupRule;
}
export declare class EgressSecurityGroupRule extends SecurityGroupRule {
    constructor(name: string, securityGroup: x.ec2.SecurityGroup, args: SimpleSecurityGroupRuleArgs | EgressSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions);
}
export declare class IngressSecurityGroupRule extends SecurityGroupRule {
    constructor(name: string, securityGroup: x.ec2.SecurityGroup, args: SimpleSecurityGroupRuleArgs | IngressSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions);
}
export interface SecurityGroupRuleArgs {
    /**
     * List of CIDR blocks. Cannot be specified with `source_security_group_id`.
     */
    cidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Description of the rule.
     */
    description?: pulumi.Input<string>;
    /**
     * The start port (or ICMP type number if protocol is "icmp").
     */
    fromPort: pulumi.Input<number>;
    /**
     * List of IPv6 CIDR blocks.
     */
    ipv6CidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * List of prefix list IDs (for allowing access to VPC endpoints). Only valid with `egress`.
     */
    prefixListIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The protocol. If not icmp, tcp, udp, or all use the [protocol
     * number](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)
     */
    protocol: pulumi.Input<string>;
    /**
     * If true, the security group itself will be added as
     * a source to this ingress rule.
     */
    self?: pulumi.Input<boolean>;
    /**
     * The security group id to allow access to/from, depending on the `type`. Cannot be specified
     * with `cidr_blocks`.
     */
    sourceSecurityGroupId?: pulumi.Input<string>;
    /**
     * The end port (or ICMP code if protocol is "icmp").
     */
    toPort: pulumi.Input<number>;
    /**
     * The type of rule being created. Valid options are `ingress` (inbound)
     * or `egress` (outbound).
     */
    type: pulumi.Input<"ingress" | "egress">;
}
export interface SimpleSecurityGroupRuleArgs {
    /**
     * The source or destination location of the rule.  This allows controlling of the ipv4 or ipv6
     * cidr blocks for the rule, or the source security group.
     *
     * There are easy ways to provide ingress or egress to the entirety of the ipv4 or ipv6 space by
     * using the AnyIPv4Location and AnyIPv6Location types.
     */
    location: SecurityGroupRuleLocation;
    /**
     * The ports and protocol this rule allows access to/from.  There are easy ways to open anything
     * from a single port, to a wide set of ports, to all ports and all protocols using:
     *
     * [TcpPorts], [AllTcpPorts], [UdpPorts], [AllUdpPorts], [IcmpPorts], [AllTraffic]
     */
    ports: SecurityGroupRulePorts;
    /**
     * Optional description for the rule to make it easier to document in the AWS console.
     */
    description?: pulumi.Input<string>;
}
export interface EgressSecurityGroupRuleArgs {
    /**
     * List of CIDR blocks. Cannot be specified with `source_security_group_id`.
     */
    cidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Description of the rule.
     */
    description?: pulumi.Input<string>;
    /**
     * The start port (or ICMP type number if protocol is "icmp").
     */
    fromPort: pulumi.Input<number>;
    /**
     * List of IPv6 CIDR blocks.
     */
    ipv6CidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * List of prefix list IDs (for allowing access to VPC endpoints).
     */
    prefixListIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The protocol. If not icmp, tcp, udp, or all use the [protocol
     * number](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)
     */
    protocol: pulumi.Input<string>;
    /**
     * If true, the security group itself will be added as
     * a source to this ingress rule.
     */
    self?: pulumi.Input<boolean>;
    /**
     * The security group id to allow access to/from,
     * depending on the `type`. Cannot be specified with `cidr_blocks`.
     */
    sourceSecurityGroupId?: pulumi.Input<string>;
    /**
     * The end port (or ICMP code if protocol is "icmp").
     */
    toPort: pulumi.Input<number>;
}
export interface IngressSecurityGroupRuleArgs {
    /**
     * List of CIDR blocks. Cannot be specified with `source_security_group_id`.
     */
    cidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Description of the rule.
     */
    description?: pulumi.Input<string>;
    /**
     * The start port (or ICMP type number if protocol is "icmp").
     */
    fromPort: pulumi.Input<number>;
    /**
     * List of IPv6 CIDR blocks.
     */
    ipv6CidrBlocks?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The protocol. If not icmp, tcp, udp, or all use the [protocol
     * number](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)
     */
    protocol: pulumi.Input<string>;
    /**
     * If true, the security group itself will be added as
     * a source to this ingress rule.
     */
    self?: pulumi.Input<boolean>;
    /**
     * The security group id to allow access to/from,
     * depending on the `type`. Cannot be specified with `cidr_blocks`.
     */
    sourceSecurityGroupId?: pulumi.Input<string>;
    /**
     * The end port (or ICMP code if protocol is "icmp").
     */
    toPort: pulumi.Input<number>;
}
