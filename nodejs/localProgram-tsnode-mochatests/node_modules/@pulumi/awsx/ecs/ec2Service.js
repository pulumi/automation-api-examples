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
const ecs = require(".");
const x = require("..");
const utils = require("../utils");
class EC2TaskDefinition extends ecs.TaskDefinition {
    constructor(name, args, opts = {}) {
        if (!args.container && !args.containers) {
            throw new Error("Either [container] or [containers] must be provided");
        }
        const containers = args.containers || { container: args.container };
        const argsCopy = Object.assign(Object.assign({}, args), { containers, requiresCompatibilities: ["EC2"], networkMode: utils.ifUndefined(args.networkMode, "awsvpc") });
        delete argsCopy.container;
        super("awsx:x:ecs:EC2TaskDefinition", name, /*isFargate:*/ false, argsCopy, opts);
        this.registerOutputs();
    }
    /**
     * Creates a service with this as its task definition.
     */
    createService(name, args, opts = {}) {
        if (args.taskDefinition) {
            throw new Error("[args.taskDefinition] should not be provided.");
        }
        if (args.taskDefinitionArgs) {
            throw new Error("[args.taskDefinitionArgs] should not be provided.");
        }
        return new ecs.EC2Service(name, Object.assign(Object.assign({}, args), { taskDefinition: this }), Object.assign({ parent: this }, opts));
    }
}
exports.EC2TaskDefinition = EC2TaskDefinition;
class EC2Service extends ecs.Service {
    constructor(name, args, opts = {}) {
        if (!args.taskDefinition && !args.taskDefinitionArgs) {
            throw new Error("Either [taskDefinition] or [taskDefinitionArgs] must be provided");
        }
        const cluster = args.cluster || x.ecs.Cluster.getDefault();
        const taskDefinition = args.taskDefinition ||
            new ecs.EC2TaskDefinition(name, Object.assign(Object.assign({}, args.taskDefinitionArgs), { vpc: cluster.vpc }), opts);
        const securityGroups = x.ec2.getSecurityGroups(cluster.vpc, name, args.securityGroups || cluster.securityGroups, opts) || [];
        const subnets = args.subnets || cluster.vpc.publicSubnetIds;
        super("awsx:x:ecs:EC2Service", name, Object.assign(Object.assign({}, args), { taskDefinition,
            securityGroups, launchType: "EC2", networkConfiguration: taskDefinition.taskDefinition.networkMode.apply(n => {
                // The network configuration for the service. This parameter is required for task
                // definitions that use the `awsvpc` network mode to receive their own Elastic
                // Network Interface, and it is not supported for other network modes.
                if (n !== "awsvpc") {
                    return undefined;
                }
                return {
                    subnets,
                    assignPublicIp: false,
                    securityGroups: securityGroups.map(g => g.id),
                };
            }) }), opts);
        this.taskDefinition = taskDefinition;
        this.registerOutputs();
    }
}
exports.EC2Service = EC2Service;
// Make sure our exported args shape is compatible with the overwrite shape we're trying to provide.
const test1 = utils.checkCompat();
const test2 = utils.checkCompat();
//# sourceMappingURL=ec2Service.js.map