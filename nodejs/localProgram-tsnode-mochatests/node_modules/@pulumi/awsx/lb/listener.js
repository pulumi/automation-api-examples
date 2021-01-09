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
class Listener extends pulumi.ComponentResource {
    constructor(type, name, defaultListenerAction, args, opts) {
        // By default, we'd like to be parented by the LB .  However, we didn't use to do this.
        // Create an alias from teh old urn to the new one so that we don't cause these to eb
        // created/destroyed.
        super(type, name, {}, Object.assign({ parent: args.loadBalancer }, pulumi.mergeOptions(opts, { aliases: [{ parent: opts.parent }] })));
        // tslint:disable-next-line:variable-name
        this.__isListenerInstance = true;
        // If SSL is used, and no ssl policy was  we automatically insert the recommended ELB
        // security policy from:
        // http://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html.
        const defaultSslPolicy = pulumi.output(args.certificateArn)
            .apply(a => a ? "ELBSecurityPolicy-2016-08" : undefined);
        this.listener = args.listener || new aws.lb.Listener(name, Object.assign(Object.assign({}, args), { loadBalancerArn: args.loadBalancer.loadBalancer.arn, sslPolicy: utils.ifUndefined(args.sslPolicy, defaultSslPolicy) }), { parent: this });
        const loadBalancer = args.loadBalancer.loadBalancer;
        this.endpoint = this.listener.urn.apply(_ => pulumi.output({
            hostname: loadBalancer.dnsName,
            port: args.port,
        }));
        this.loadBalancer = args.loadBalancer;
        this.defaultListenerAction = defaultListenerAction;
        if (defaultListenerAction instanceof mod.TargetGroup) {
            this.defaultTargetGroup = defaultListenerAction;
        }
        if (defaultListenerAction) {
            // If our default rule hooked up this listener to a target group, then add our listener
            // to the set of listeners the target group knows about.  This is necessary so that
            // anything that depends on the target group will end up depending on this rule getting
            // created.
            defaultListenerAction.registerListener(this);
        }
    }
    /** @internal */
    static isListenerInstance(obj) {
        return obj && !!obj.__isListenerInstance;
    }
    containerPortMapping(name, parent) {
        if (!x.ecs.isContainerPortMappingProvider(this.defaultListenerAction)) {
            throw new Error("[Listener] was not connected to a [defaultAction] that can provide [portMapping]s");
        }
        return this.defaultListenerAction.containerPortMapping(name, parent);
    }
    containerLoadBalancer(name, parent) {
        if (!x.ecs.isContainerLoadBalancerProvider(this.defaultListenerAction)) {
            throw new Error("[Listener] was not connected to a [defaultAction] that can provide [containerLoadBalancer]s");
        }
        return this.defaultListenerAction.containerLoadBalancer(name, parent);
    }
    addListenerRule(name, args, opts) {
        return new x.lb.ListenerRule(name, this, args, opts);
    }
    /**
     * Attaches a target to the `defaultTargetGroup` for this Listener.
     */
    attachTarget(name, args, opts = {}) {
        if (!this.defaultTargetGroup) {
            throw new pulumi.ResourceError("Listener must have a [defaultTargetGroup] in order to attach a target.", this);
        }
        return this.defaultTargetGroup.attachTarget(name, args, opts);
    }
}
exports.Listener = Listener;
utils.Capture(Listener.prototype).containerPortMapping.doNotCapture = true;
utils.Capture(Listener.prototype).containerLoadBalancer.doNotCapture = true;
utils.Capture(Listener.prototype).addListenerRule.doNotCapture = true;
utils.Capture(Listener.prototype).attachTarget.doNotCapture = true;
/** @internal */
function isListenerDefaultAction(obj) {
    return obj &&
        obj.listenerDefaultAction instanceof Function &&
        obj.registerListener instanceof Function;
}
exports.isListenerDefaultAction = isListenerDefaultAction;
/** @internal */
function isListenerActions(obj) {
    return obj &&
        obj.actions instanceof Function &&
        obj.registerListener instanceof Function;
}
exports.isListenerActions = isListenerActions;
const test1 = utils.checkCompat();
//# sourceMappingURL=listener.js.map