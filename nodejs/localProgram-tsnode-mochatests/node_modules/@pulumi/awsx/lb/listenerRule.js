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
const x = require("..");
const utils = require("../utils");
/**
 * The rules that you define for your listener determine how the load balancer routes requests to
 * the targets in one or more target groups.
 *
 * Each rule consists of a priority, one or more actions, an optional host condition, and an
 * optional path condition. For more information, see
 * https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html
 */
class ListenerRule extends pulumi.ComponentResource {
    constructor(name, listener, args, opts = {}) {
        // We forgot to add the `ListenerRule` part of the name.  Add it in and create an alias from
        // the previous incorrect name.
        super("awsx:lb:ListenerRule", name, {}, Object.assign({ parent: listener }, pulumi.mergeOptions(opts, { aliases: [
                { type: "awsx:x:elasticloadbalancingv2" },
                { type: "awsx:x:elasticloadbalancingv2:ListenerRule" }
            ] })));
        const actions = x.lb.isListenerActions(args.actions)
            ? args.actions.actions()
            : args.actions;
        this.listenerRule = new aws.lb.ListenerRule(name, Object.assign(Object.assign({}, args), { actions, listenerArn: listener.listener.arn }), { parent: this });
        // If this is a rule hooking up this listener to a target group, then add our listener to
        // the set of listeners the target group knows about.  This is necessary so that anything
        // that depends on the target group will end up depending on this rule getting created.
        if (x.lb.isListenerActions(args.actions)) {
            args.actions.registerListener(listener);
        }
        this.registerOutputs();
    }
}
exports.ListenerRule = ListenerRule;
const test1 = utils.checkCompat();
//# sourceMappingURL=listenerRule.js.map