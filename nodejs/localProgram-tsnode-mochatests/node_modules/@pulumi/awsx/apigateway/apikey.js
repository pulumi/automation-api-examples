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
// These APIs are currently experimental and may change.
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
/**
 * Helper function that allows you to quickly create API Keys and associate them with an API.
 *
 * @param name The _unique_ name of the resource.
 * @param args The arguments to use to populate this resource's properties.
 */
function createAssociatedAPIKeys(name, args, opts = {}) {
    const usagePlan = getUsagePlan(name, args, opts);
    const keys = getKeys(name, args, usagePlan);
    return { usagePlan, keys };
}
exports.createAssociatedAPIKeys = createAssociatedAPIKeys;
/** @internal */
function getUsagePlan(name, args, opts) {
    if (args.usagePlan && pulumi.CustomResource.isInstance(args.usagePlan)) {
        if (args.apis) {
            throw new Error("cannot define both [args.apis] and an existing usagePlan [args.usagePlan]");
        }
        return args.usagePlan;
    }
    else {
        let usagePlanArgs = args.usagePlan;
        if (args.apis) {
            const stages = [];
            for (const a of args.apis) {
                stages.push({
                    apiId: a.restAPI.id,
                    stage: a.stage.stageName,
                });
            }
            if (args.usagePlan) {
                if (args.usagePlan.apiStages) {
                    throw new Error("cannot define both [args.apis] and [args.usagePlan.apiStages]");
                }
                usagePlanArgs = {
                    apiStages: stages,
                    description: args.usagePlan.description,
                    name: args.usagePlan.name,
                    productCode: args.usagePlan.productCode,
                    quotaSettings: args.usagePlan.quotaSettings,
                    throttleSettings: args.usagePlan.throttleSettings,
                };
            }
            else {
                usagePlanArgs = {
                    apiStages: stages,
                };
            }
        }
        // We previously did not parent the UsagePlan. We now do. Provide an alias so this doesn't
        // cause resources to be destroyed/recreated for existing stacks.
        return new aws.apigateway.UsagePlan(name, usagePlanArgs, pulumi.mergeOptions(opts, { aliases: [{ parent: pulumi.rootStackResource }] }));
    }
}
/** @internal */
function getKeys(name, args, usagePlan) {
    const keys = [];
    if (args.apiKeys) {
        for (let i = 0; i < args.apiKeys.length; i++) {
            const currKey = args.apiKeys[i];
            // We previously did not parent the ApiKey or UsagePlanKey. We now do. Provide an alias so this doesn't
            // cause resources to be destroyed/recreated for existing stacks.
            const childName = `${name}-${i}`;
            const apikey = pulumi.CustomResource.isInstance(currKey)
                ? currKey
                : new aws.apigateway.ApiKey(childName, currKey, { aliases: [{ parent: pulumi.rootStackResource }], parent: usagePlan });
            const usagePlanKey = new aws.apigateway.UsagePlanKey(childName, {
                keyId: apikey.id,
                keyType: "API_KEY",
                usagePlanId: usagePlan.id,
            }, { aliases: [{ parent: pulumi.rootStackResource }], parent: usagePlan });
            keys.push({ apikey, usagePlanKey });
        }
    }
    return keys;
}
exports.apiKeySecurityDefinition = {
    type: "apiKey",
    name: "x-api-key",
    in: "header",
};
//# sourceMappingURL=apikey.js.map