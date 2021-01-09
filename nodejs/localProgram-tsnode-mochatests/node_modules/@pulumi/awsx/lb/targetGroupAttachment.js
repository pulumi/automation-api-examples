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
// tslint:disable:max-line-length
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const mod = require(".");
class TargetGroupAttachment extends pulumi.ComponentResource {
    constructor(name, targetGroup, args, opts = {}) {
        opts = pulumi.mergeOptions(opts, { aliases: [{ type: "awsx:elasticloadbalancingv2:TargetGroupAttachment" }] });
        super("awsx:lb:TargetGroupAttachment", name, undefined, Object.assign({ parent: targetGroup }, opts));
        const { targetInfo, func, permission } = getTargetInfo(this, targetGroup, name, args);
        const dependsOn = permission ? [permission] : [];
        this.targetGroupAttachment = new aws.lb.TargetGroupAttachment(name, {
            availabilityZone: targetInfo.availabilityZone,
            port: targetInfo.port,
            targetGroupArn: targetGroup.targetGroup.arn,
            targetId: targetInfo.targetId,
        }, { parent: this, dependsOn });
        this.func = func;
        this.permission = permission;
        this.registerOutputs();
    }
}
exports.TargetGroupAttachment = TargetGroupAttachment;
function getTargetInfo(parent, targetGroup, name, args) {
    if (aws.ec2.Instance.isInstance(args)) {
        return { targetInfo: getEc2InstanceTargetInfo(targetGroup, args), permission: undefined, func: undefined };
    }
    if (aws.lambda.Function.isInstance(args)) {
        return getLambdaFunctionTargetInfo(parent, targetGroup, name, args);
    }
    if (args instanceof Function) {
        return getLambdaFunctionTargetInfo(parent, targetGroup, name, new aws.lambda.CallbackFunction(name, { callback: args }, { parent }));
    }
    if (mod.isLoadBalancerTargetInfoProvider(args)) {
        const targetType = targetGroup.targetGroup.targetType;
        return { targetInfo: args.loadBalancerTargetInfo(targetType), permission: undefined, func: undefined };
    }
    return { targetInfo: pulumi.output(args), permission: undefined, func: undefined };
}
/**
 * Allows an EC2 instance to simply be used as the target of an ALB or NLB.  To use, just call:
 */
function getEc2InstanceTargetInfo(targetGroup, instance) {
    const targetInfo = pulumi.output([targetGroup.targetGroup.targetType, instance.id, instance.privateIp, instance.availabilityZone])
        .apply(([targetType, instanceId, privateIp, availabilityZone]) => {
        if (targetType === "lambda") {
            throw new pulumi.ResourceError("Cannot connect a [TargetGroup] with type [lambda] to an ec2.Instance", targetGroup);
        }
        return {
            targetId: targetType === "instance" ? instanceId : privateIp,
            availabilityZone: availabilityZone,
        };
    });
    return targetInfo;
}
/**
 * Allows a Lambda to simply be used as the target of an ALB.  To use, just call:
 */
function getLambdaFunctionTargetInfo(parent, targetGroup, name, func) {
    const permission = new aws.lambda.Permission(name, {
        action: "lambda:InvokeFunction",
        function: func,
        principal: "elasticloadbalancing.amazonaws.com",
        sourceArn: targetGroup.targetGroup.arn,
    }, { parent });
    const targetInfo = pulumi.output([targetGroup.targetGroup.targetType, func.arn])
        .apply(([targetType, lambdaArn]) => {
        if (targetType !== "lambda") {
            throw new pulumi.ResourceError("Can only connect a [TargetGroup] with type [lambda] to an aws.lambda.Function", targetGroup);
        }
        return {
            targetId: lambdaArn,
        };
    });
    return { targetInfo, func, permission };
}
//# sourceMappingURL=targetGroupAttachment.js.map