"use strict";
// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const x = require("..");
const utils = require("../utils");
let defaultCluster;
/**
 * A Cluster is a general purpose ECS cluster configured to run in a provided Network.
 */
class Cluster extends pulumi.ComponentResource {
    constructor(name, args = {}, opts = {}) {
        super("awsx:x:ecs:Cluster", name, {}, opts);
        this.autoScalingGroups = [];
        // First create an ECS cluster.
        const cluster = getOrCreateCluster(name, args, this);
        this.cluster = cluster;
        this.id = cluster.id;
        this.vpc = args.vpc || x.ec2.Vpc.getDefault({ parent: this });
        // IDEA: Can we re-use the network's default security group instead of creating a specific
        // new security group in the Cluster layer?  This may allow us to share a single Security Group
        // across both instance and Lambda compute.
        this.securityGroups = x.ec2.getSecurityGroups(this.vpc, name, args.securityGroups, { parent: this }) ||
            [Cluster.createDefaultSecurityGroup(name, this.vpc, { parent: this })];
        this.extraBootcmdLines = () => cluster.id.apply(clusterId => [{ contents: `- echo ECS_CLUSTER='${clusterId}' >> /etc/ecs/ecs.config` }]);
        this.registerOutputs();
    }
    addAutoScalingGroup(group) {
        this.autoScalingGroups.push(group);
    }
    /**
     * Creates a new autoscaling group and adds it to the list of autoscaling groups targeting this
     * cluster.  The autoscaling group will be created with is network set to the same network as
     * this cluster as well as using this cluster to initialize both its securityGroups and
     * launchConfiguration userData.
     */
    createAutoScalingGroup(name, args = {}, opts = {}) {
        args.vpc = args.vpc || this.vpc;
        args.launchConfigurationArgs = Object.assign({ 
            // default to our security groups if the caller didn't provide their own.
            securityGroups: this.securityGroups, userData: this }, args.launchConfigurationArgs);
        const group = new x.autoscaling.AutoScalingGroup(name, args, Object.assign({ parent: this }, opts));
        this.addAutoScalingGroup(group);
        return group;
    }
    /**
     * Gets or creates a cluster that can be used by default for the current aws account and region.
     * The cluster will use the default Vpc for the account and will be provisioned with a security
     * group created by [createDefaultSecurityGroup].
     */
    static getDefault(opts) {
        if (!defaultCluster) {
            defaultCluster = new Cluster("default-cluster", {}, opts);
        }
        return defaultCluster;
    }
    static createDefaultSecurityGroup(name, vpc, opts = {}) {
        vpc = vpc || x.ec2.Vpc.getDefault(opts);
        const securityGroup = new x.ec2.SecurityGroup(name, {
            vpc,
            tags: { Name: name },
        }, opts);
        Cluster.createDefaultSecurityGroupEgressRules(name, securityGroup);
        Cluster.createDefaultSecurityGroupIngressRules(name, securityGroup);
        return securityGroup;
    }
    static createDefaultSecurityGroupEgressRules(name, securityGroup) {
        return [x.ec2.SecurityGroupRule.egress(`${name}-egress`, securityGroup, new x.ec2.AnyIPv4Location(), new x.ec2.AllTraffic(), "allow output to any ipv4 address using any protocol")];
    }
    static createDefaultSecurityGroupIngressRules(name, securityGroup) {
        return [x.ec2.SecurityGroupRule.ingress(`${name}-ssh`, securityGroup, new x.ec2.AnyIPv4Location(), new x.ec2.TcpPorts(22), "allow ssh in from any ipv4 address"),
            // Expose ephemeral container ports to Internet.
            // TODO: Limit to load balancer(s).
            x.ec2.SecurityGroupRule.ingress(`${name}-containers`, securityGroup, new x.ec2.AnyIPv4Location(), new x.ec2.AllTcpPorts(), "allow incoming tcp on any port from any ipv4 address")];
    }
}
exports.Cluster = Cluster;
utils.Capture(Cluster.prototype).createAutoScalingGroup.doNotCapture = true;
function getOrCreateCluster(name, args, parent) {
    if (args.cluster === undefined) {
        return new aws.ecs.Cluster(name, args, { parent });
    }
    if (pulumi.Resource.isInstance(args.cluster)) {
        return args.cluster;
    }
    return aws.ecs.Cluster.get(name, args.cluster, undefined, { parent });
}
// Make sure our exported args shape is compatible with the overwrite shape we're trying to provide.
const test1 = utils.checkCompat();
//# sourceMappingURL=cluster.js.map