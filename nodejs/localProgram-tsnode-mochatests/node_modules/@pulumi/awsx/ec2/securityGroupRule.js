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
class AnyIPv4Location {
    constructor() {
        this.cidrBlocks = ["0.0.0.0/0"];
    }
}
exports.AnyIPv4Location = AnyIPv4Location;
class AnyIPv6Location {
    constructor() {
        // From https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html
        // "::/0" - Allow all outbound IPv6 traffic.
        this.ipv6CidrBlocks = ["::/0"];
    }
}
exports.AnyIPv6Location = AnyIPv6Location;
class TcpPorts {
    constructor(fromPort, toPort) {
        this.fromPort = fromPort;
        this.toPort = toPort;
        this.protocol = "tcp";
    }
}
exports.TcpPorts = TcpPorts;
const maxPort = 65535;
class AllTcpPorts extends TcpPorts {
    constructor() {
        super(0, maxPort);
    }
}
exports.AllTcpPorts = AllTcpPorts;
class UdpPorts {
    constructor(fromPort, toPort) {
        this.fromPort = fromPort;
        this.toPort = toPort;
        this.protocol = "udp";
    }
}
exports.UdpPorts = UdpPorts;
class AllUdpPorts extends UdpPorts {
    constructor() {
        super(0, maxPort);
    }
}
exports.AllUdpPorts = AllUdpPorts;
class IcmpPorts {
    constructor(fromPort, toPort) {
        this.fromPort = fromPort;
        this.toPort = toPort;
        this.protocol = "icmp";
    }
}
exports.IcmpPorts = IcmpPorts;
class AllTraffic {
    constructor() {
        this.protocol = "-1";
        this.fromPort = 0;
        this.toPort = 0;
    }
}
exports.AllTraffic = AllTraffic;
class SecurityGroupRule extends pulumi.ComponentResource {
    constructor(type, name, securityGroup, args, opts) {
        super(type, name, {}, Object.assign({ parent: securityGroup }, opts));
        this.securityGroup = securityGroup;
        this.securityGroupRule = new aws.ec2.SecurityGroupRule(name, Object.assign(Object.assign({}, args), { securityGroupId: securityGroup.id }), { parent: this });
        this.registerOutputs();
    }
    static egressArgs(destination, ports, description) {
        return SecurityGroupRule.createArgs(destination, ports, description);
    }
    static ingressArgs(source, ports, description) {
        return SecurityGroupRule.createArgs(source, ports, description);
    }
    static createArgs(location, ports, description) {
        return Object.assign(Object.assign(Object.assign({}, location), ports), { toPort: utils.ifUndefined(ports.toPort, ports.fromPort), description });
    }
    static egress(name, securityGroup, destination, ports, description, opts) {
        return new EgressSecurityGroupRule(name, securityGroup, SecurityGroupRule.egressArgs(destination, ports, description), opts);
    }
    static ingress(name, securityGroup, source, ports, description, opts) {
        return new IngressSecurityGroupRule(name, securityGroup, SecurityGroupRule.ingressArgs(source, ports, description), opts);
    }
}
exports.SecurityGroupRule = SecurityGroupRule;
class EgressSecurityGroupRule extends SecurityGroupRule {
    constructor(name, securityGroup, args, opts = {}) {
        if (x.ec2.isSimpleSecurityGroupRuleArgs(args)) {
            args = x.ec2.SecurityGroupRule.egressArgs(args.location, args.ports, args.description);
        }
        super("awsx:x:ec2:EgressSecurityGroupRule", name, securityGroup, Object.assign(Object.assign({}, args), { type: "egress" }), opts);
        securityGroup.egressRules.push(this);
    }
}
exports.EgressSecurityGroupRule = EgressSecurityGroupRule;
class IngressSecurityGroupRule extends SecurityGroupRule {
    constructor(name, securityGroup, args, opts = {}) {
        if (x.ec2.isSimpleSecurityGroupRuleArgs(args)) {
            args = x.ec2.SecurityGroupRule.ingressArgs(args.location, args.ports, args.description);
        }
        super("awsx:x:ec2:IngressSecurityGroupRule", name, securityGroup, Object.assign(Object.assign({}, args), { type: "ingress" }), opts);
        securityGroup.ingressRules.push(this);
    }
}
exports.IngressSecurityGroupRule = IngressSecurityGroupRule;
/** @internal */
function isSimpleSecurityGroupRuleArgs(obj) {
    const args = obj;
    return args && args.location !== undefined && args.ports !== undefined;
}
exports.isSimpleSecurityGroupRuleArgs = isSimpleSecurityGroupRuleArgs;
// Make sure our exported args shape is compatible with the overwrite shape we're trying to provide.
const test1 = utils.checkCompat();
const test2 = utils.checkCompat();
const test3 = utils.checkCompat();
//# sourceMappingURL=securityGroupRule.js.map