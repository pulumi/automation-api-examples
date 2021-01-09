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
class SecurityGroup extends pulumi.ComponentResource {
    constructor(name, args = {}, opts = {}) {
        super("awsx:x:ec2:SecurityGroup", name, {}, opts);
        this.egressRules = [];
        this.ingressRules = [];
        // tslint:disable-next-line:variable-name
        this.__isSecurityGroupInstance = true;
        // We allow egress/ingress rules to be defined in-line for SecurityGroup (like terraform
        // does). However, we handle these by explicitly *not* passing this to the security group,
        // and instead manually making SecurityGroupRules.  This ensures that rules can be added
        // after the fact (for example, if someone wants to open an app-listener up later).
        // TerraForm doesn't support both inlined and after-the-fact rules.  So we just make
        // everything after-the-fact to make the programming model simple and to allow users to
        // mix/match both styles if they prefer.
        const egressRules = args.egress || [];
        const ingressRules = args.ingress || [];
        // Explicitly delete these props so we do *not* pass them into the SecurityGroup created
        // below.
        delete args.egress;
        delete args.ingress;
        this.vpc = args.vpc || x.ec2.Vpc.getDefault({ parent: this });
        this.securityGroup = args.securityGroup || new aws.ec2.SecurityGroup(name, Object.assign(Object.assign({}, args), { vpcId: this.vpc.id }), { parent: this });
        this.id = this.securityGroup.id;
        this.registerOutputs();
        for (let i = 0, n = egressRules.length; i < n; i++) {
            this.createEgressRule(`${name}-egress-${i}`, egressRules[i]);
        }
        for (let i = 0, n = ingressRules.length; i < n; i++) {
            this.createIngressRule(`${name}-ingress-${i}`, ingressRules[i]);
        }
    }
    /** @internal */
    static isSecurityGroupInstance(obj) {
        return !!obj.__isSecurityGroupInstance;
    }
    /**
     * Get an existing SecurityGroup resource's state with the given name and ID. This will not
     * cause a SecurityGroup to be created, and removing this SecurityGroup from your pulumi
     * application will not cause the existing cloud resource to be destroyed.
     */
    static fromExistingId(name, id, args = {}, opts = {}) {
        return new SecurityGroup(name, Object.assign(Object.assign({}, args), { securityGroup: aws.ec2.SecurityGroup.get(name, id, {}, opts) }), opts);
    }
    createEgressRule(name, args, opts) {
        return new x.ec2.EgressSecurityGroupRule(name, this, args, opts);
    }
    createIngressRule(name, args, opts) {
        return new x.ec2.IngressSecurityGroupRule(name, this, args, opts);
    }
}
exports.SecurityGroup = SecurityGroup;
utils.Capture(SecurityGroup.prototype).createEgressRule.doNotCapture = true;
utils.Capture(SecurityGroup.prototype).createIngressRule.doNotCapture = true;
/** @internal */
function getSecurityGroups(vpc, name, args, opts) {
    if (!args) {
        return undefined;
    }
    const result = [];
    for (let i = 0, n = args.length; i < n; i++) {
        const obj = args[i];
        if (x.ec2.SecurityGroup.isSecurityGroupInstance(obj)) {
            result.push(obj);
        }
        else {
            result.push(x.ec2.SecurityGroup.fromExistingId(`${name}-${i}`, obj, { vpc }, opts));
        }
    }
    return result;
}
exports.getSecurityGroups = getSecurityGroups;
// Make sure our exported args shape is compatible with the overwrite shape we're trying to provide.
const test1 = utils.checkCompat();
//# sourceMappingURL=securityGroup.js.map