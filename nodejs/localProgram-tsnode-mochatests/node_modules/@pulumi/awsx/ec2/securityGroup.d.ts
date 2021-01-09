import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as x from "..";
export declare class SecurityGroup extends pulumi.ComponentResource {
    readonly securityGroup: aws.ec2.SecurityGroup;
    readonly id: pulumi.Output<string>;
    readonly vpc: x.ec2.Vpc;
    readonly egressRules: x.ec2.EgressSecurityGroupRule[];
    readonly ingressRules: x.ec2.IngressSecurityGroupRule[];
    private readonly __isSecurityGroupInstance;
    constructor(name: string, args?: SecurityGroupArgs, opts?: pulumi.ComponentResourceOptions);
    /**
     * Get an existing SecurityGroup resource's state with the given name and ID. This will not
     * cause a SecurityGroup to be created, and removing this SecurityGroup from your pulumi
     * application will not cause the existing cloud resource to be destroyed.
     */
    static fromExistingId(name: string, id: pulumi.Input<string>, args?: SecurityGroupArgs, opts?: pulumi.ComponentResourceOptions): x.ec2.SecurityGroup;
    createEgressRule(name: string, args: x.ec2.SimpleSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions): x.ec2.EgressSecurityGroupRule;
    createEgressRule(name: string, args: x.ec2.EgressSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions): x.ec2.EgressSecurityGroupRule;
    createIngressRule(name: string, args: x.ec2.SimpleSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions): x.ec2.IngressSecurityGroupRule;
    createIngressRule(name: string, args: x.ec2.IngressSecurityGroupRuleArgs, opts?: pulumi.ComponentResourceOptions): x.ec2.IngressSecurityGroupRule;
}
export declare type SecurityGroupOrId = SecurityGroup | pulumi.Input<string>;
export interface SecurityGroupArgs {
    /**
     * An existing SecurityGroup to use for this awsx SecurityGroup.  If not provided, a default
     * one will be created.
     */
    securityGroup?: aws.ec2.SecurityGroup;
    /**
     * The vpc this security group applies to.  Or [Vpc.getDefault] if unspecified.
     */
    vpc?: x.ec2.Vpc;
    /**
     * The security group description. Defaults to "Managed by Terraform". Cannot be "". __NOTE__:
     * This field maps to the AWS `GroupDescription` attribute, for which there is no Update API. If
     * you'd like to classify your security groups in a way that can be updated, use `tags`.
     */
    description?: pulumi.Input<string>;
    /**
     * Can be specified multiple times for each egress rule. Each egress block supports fields
     * documented below.
     */
    egress?: x.ec2.EgressSecurityGroupRuleArgs[];
    /**
     * Can be specified multiple times for each ingress rule. Each ingress block supports fields
     * documented below.
     */
    ingress?: x.ec2.IngressSecurityGroupRuleArgs[];
    /**
     * Instruct Terraform to revoke all of the Security Groups attached ingress and egress rules
     * before deleting the rule itself. This is normally not needed, however certain AWS services
     * such as Elastic Map Reduce may automatically add required rules to security groups used with
     * the service, and those rules may contain a cyclic dependency that prevent the security groups
     * from being destroyed without removing the dependency first. Default `false`
     */
    revokeRulesOnDelete?: pulumi.Input<boolean>;
    tags?: pulumi.Input<aws.Tags>;
}
