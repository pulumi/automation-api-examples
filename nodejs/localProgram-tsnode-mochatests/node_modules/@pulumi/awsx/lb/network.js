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
const x = require("..");
const utils = require("../utils");
class NetworkLoadBalancer extends mod.LoadBalancer {
    constructor(name, args = {}, opts = {}) {
        const argsCopy = Object.assign(Object.assign({}, args), { loadBalancerType: "network" });
        opts = pulumi.mergeOptions(opts, { aliases: [{ type: "awsx:x:elasticloadbalancingv2:NetworkLoadBalancer" }] });
        super("awsx:lb:NetworkLoadBalancer", name, argsCopy, opts);
        this.listeners = [];
        this.targetGroups = [];
        this.registerOutputs();
    }
    createListener(name, args, opts = {}) {
        return new NetworkListener(name, Object.assign({ loadBalancer: this }, args), Object.assign({ parent: this }, opts));
    }
    createTargetGroup(name, args, opts = {}) {
        return new NetworkTargetGroup(name, Object.assign({ loadBalancer: this }, args), Object.assign({ parent: this }, opts));
    }
}
exports.NetworkLoadBalancer = NetworkLoadBalancer;
/**
 * Each target group is used to route requests to one or more registered targets. When you create
 * each listener rule, you specify a target group and conditions. When a rule condition is met,
 * traffic is forwarded to the corresponding target group. You can create different target groups
 * for different types of requests. For example, create one target group for general requests and
 * other target groups for requests to the microservices for your application.

 * You define health check settings for your load balancer on a per target group basis. Each target
 * group uses the default health check settings, unless you override them when you create the target
 * group or modify them later on. After you specify a target group in a rule for a listener, the
 * load balancer continually monitors the health of all targets registered with the target group
 * that are in an Availability Zone enabled for the load balancer. The load balancer routes requests
 * to the registered targets that are healthy.
 *
 * See https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html
 * for more details.
 */
class NetworkTargetGroup extends mod.TargetGroup {
    constructor(name, args, opts = {}) {
        const loadBalancer = args.loadBalancer || new NetworkLoadBalancer(name, {
            vpc: args.vpc,
            name: args.name,
        }, opts);
        const protocol = utils.ifUndefined(args.protocol, "TCP");
        opts = pulumi.mergeOptions(opts, { aliases: [{ type: "awsx:x:elasticloadbalancingv2:NetworkTargetGroup" }] });
        super("awsx:lb:NetworkTargetGroup", name, loadBalancer, Object.assign(Object.assign({}, args), { protocol, vpc: loadBalancer.vpc }), Object.assign({ parent: loadBalancer }, opts));
        this.listeners = [];
        this.loadBalancer = loadBalancer;
        loadBalancer.targetGroups.push(this);
        this.registerOutputs();
    }
    createListener(name, args, opts = {}) {
        return new NetworkListener(name, Object.assign({ defaultAction: this, loadBalancer: this.loadBalancer }, args), Object.assign({ parent: this }, opts));
    }
}
exports.NetworkTargetGroup = NetworkTargetGroup;
/**
 * A listener is a process that checks for connection requests, using the protocol and port that you
 * configure. The rules that you define for a listener determine how the load balancer routes
 * requests to the targets in one or more target groups.
 *
 * See https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html
 * for more details.
 */
class NetworkListener extends mod.Listener {
    constructor(name, args, opts = {}) {
        const argCount = (args.defaultAction ? 1 : 0) +
            (args.defaultActions ? 1 : 0) +
            (args.targetGroup ? 1 : 0);
        if (argCount >= 2) {
            throw new Error("Only provide one of [defaultAction], [defaultActions] or [targetGroup].");
        }
        const loadBalancer = pulumi.Resource.isInstance(args.loadBalancer)
            ? args.loadBalancer
            : new NetworkLoadBalancer(name, Object.assign(Object.assign({}, args.loadBalancer), { vpc: args.vpc, name: args.name }), opts);
        const { defaultActions, defaultListener } = getDefaultActions(name, loadBalancer, args, opts);
        const protocol = utils.ifUndefined(args.protocol, "TCP");
        opts = pulumi.mergeOptions(opts, { aliases: [{ type: "awsx:x:elasticloadbalancingv2:NetworkListener" }] });
        super("awsx:lb:NetworkListener", name, defaultListener, Object.assign(Object.assign({}, args), { protocol,
            loadBalancer,
            defaultActions }), opts);
        this.__isNetworkListenerInstance = true;
        this.loadBalancer = loadBalancer;
        loadBalancer.listeners.push(this);
        this.registerOutputs();
    }
    /** @internal */
    static isNetworkListenerInstance(obj) {
        return obj && !!obj.__isNetworkListenerInstance;
    }
    target(name, parent) {
        // create a VpcLink to the load balancer in the VPC
        const vpcLink = new aws.apigateway.VpcLink(name, {
            targetArn: this.loadBalancer.loadBalancer.arn,
        }, { parent });
        return this.endpoint.apply(ep => ({
            uri: `http://${ep.hostname}:${ep.port}/`,
            type: "http_proxy",
            connectionType: "VPC_LINK",
            connectionId: vpcLink.id,
        }));
    }
}
exports.NetworkListener = NetworkListener;
function getDefaultActions(name, loadBalancer, args, opts) {
    if (args.defaultActions) {
        return { defaultActions: args.defaultActions, defaultListener: undefined };
    }
    if (args.defaultAction) {
        return x.lb.isListenerDefaultAction(args.defaultAction)
            ? { defaultActions: [args.defaultAction.listenerDefaultAction()], defaultListener: args.defaultAction }
            : { defaultActions: [args.defaultAction], defaultListener: undefined };
    }
    // User didn't provide default actions for this listener.  Create a reasonable target group for
    // us and use that as our default action.
    const targetGroup = createTargetGroup();
    return { defaultActions: [targetGroup.listenerDefaultAction()], defaultListener: targetGroup };
    function createTargetGroup() {
        // Use the target group if provided by the client.  Otherwise, create a reasonable default
        // one for our LB that will connect to this listener's port.
        if (pulumi.Resource.isInstance(args.targetGroup)) {
            return args.targetGroup;
        }
        else if (args.targetGroup) {
            return new NetworkTargetGroup(name, Object.assign(Object.assign({}, args.targetGroup), { loadBalancer }), opts);
        }
        else {
            return new NetworkTargetGroup(name, {
                loadBalancer,
                name: args.name,
                port: args.port,
            }, opts);
        }
    }
}
//# sourceMappingURL=network.js.map