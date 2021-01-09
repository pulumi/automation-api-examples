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
class LifecyclePolicy extends aws.ecr.LifecyclePolicy {
    /**
     * Creates a new [LifecyclePolicy] for the given [repository].  If [args] is not provided, then
     * [getDefaultLifecyclePolicyArgs] will be used to set the default policy for this repo.
     */
    constructor(name, repository, args, opts = {}) {
        // We previously did not parent the LifecyclePolicy to the repository. We now do. Provide an
        // alias so this doesn't cause resources to be destroyed/recreated for existing stacks.
        super(name, {
            policy: convertToJSON(args || LifecyclePolicy.defaultLifecyclePolicyArgs()),
            repository: repository.name,
        }, Object.assign({ parent: repository }, pulumi.mergeOptions(opts, { aliases: [{ parent: opts.parent }] })));
    }
    /**
     * Creates a default lifecycle policy such that at most a single untagged image is retained. All
     * tagged layers and images will never expire.
     */
    static defaultLifecyclePolicyArgs() {
        return {
            rules: [{
                    description: "remove untagged images",
                    selection: "untagged",
                    maximumNumberOfImages: 1,
                }],
        };
    }
}
exports.LifecyclePolicy = LifecyclePolicy;
/** @internal */
function convertToJSON(args) {
    return pulumi.output(args.rules).apply(rules => convertRules(rules))
        .apply(x => JSON.stringify(x));
}
exports.convertToJSON = convertToJSON;
function convertRules(rules) {
    const result = { rules: [] };
    const nonAnyRules = rules.filter(r => r.selection !== "any");
    const anyRules = rules.filter(r => r.selection === "any");
    if (anyRules.length >= 2) {
        throw new Error(`At most one [selection: "any"] rule can be provided.`);
    }
    // Place the 'any' rule last so it has higest priority.
    const orderedRules = [...nonAnyRules, ...anyRules];
    let rulePriority = 1;
    for (const rule of orderedRules) {
        result.rules.push(convertRule(rule, rulePriority));
        rulePriority++;
    }
    return result;
    function convertRule(rule, rulePriority) {
        return {
            rulePriority,
            description: rule.description,
            selection: Object.assign(Object.assign({}, convertTag()), convertCount()),
            action: { type: "expire" },
        };
        function convertCount() {
            if (rule.maximumNumberOfImages !== undefined) {
                return { countType: "imageCountMoreThan", countNumber: rule.maximumNumberOfImages, countUnit: undefined };
            }
            else if (rule.maximumAgeLimit !== undefined) {
                return { countType: "sinceImagePushed", countNumber: rule.maximumAgeLimit, countUnit: "days" };
            }
            else {
                throw new Error("Either [maximumNumberOfImages] or [maximumAgeLimit] must be provided with a rule.");
            }
        }
        function convertTag() {
            if (rule.selection === "any" || rule.selection === "untagged") {
                return { tagStatus: rule.selection, tagPrefixList: undefined };
            }
            else {
                if (rule.selection.tagPrefixList.length === 0) {
                    throw new Error("tagPrefixList cannot be empty.");
                }
                return { tagStatus: "tagged", tagPrefixList: rule.selection.tagPrefixList };
            }
        }
    }
}
//# sourceMappingURL=lifecyclePolicy.js.map